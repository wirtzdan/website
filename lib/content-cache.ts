import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Route segment `revalidate` must be the literal 3600 in each page file.
 * Next only treats that export as statically analyzable when the number is
 * written in the page itself. Keep this constant equal to those literals.
 */
export const CONTENT_REVALIDATE_SECONDS = 3600;

/** Tags for on-demand revalidation. Keep them short; Next ignores tags over 256 chars. */
export const CONTENT_CACHE_TAGS = {
  all: "content",
  blog: "content-blog",
  pages: "content-pages",
  books: "content-books",
  photos: "content-photos",
  tools: "content-tools",
  newsletters: "content-newsletters",
  bookmarks: "content-bookmarks",
} as const;

export type ContentCacheTag = (typeof CONTENT_CACHE_TAGS)[keyof typeof CONTENT_CACHE_TAGS];

const ALLOWED_TAGS = new Set<string>(Object.values(CONTENT_CACHE_TAGS));

/** Listing routes whose HTML should refresh with the data cache. */
export const CONTENT_INDEX_PATHS = [
  "/",
  "/blog",
  "/books",
  "/photos",
  "/tools",
  "/newsletter",
  "/bookmarks",
] as const;

/**
 * Dynamic route patterns. `revalidatePath(pattern, "page")` covers every
 * prerendered slug, including a slug that previously cached a 404.
 */
export const CONTENT_DYNAMIC_PATHS = ["/blog/[slug]", "/[slug]"] as const;

export type RevalidatePlan = {
  tags: string[];
  paths: string[];
  dynamicPaths: string[];
};

const MAX_REVALIDATE_BODY_CHARS = 8_192;
const MAX_PATHS = 50;

export function defaultRevalidatePlan(): RevalidatePlan {
  return {
    tags: Object.values(CONTENT_CACHE_TAGS),
    paths: [...CONTENT_INDEX_PATHS],
    dynamicPaths: [...CONTENT_DYNAMIC_PATHS],
  };
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/** Constant-time secret check. A missing expected secret never matches. */
export function secretsMatch(provided: string | null, expected: string | undefined): boolean {
  if (!expected || !provided) {
    return false;
  }
  return timingSafeEqual(digest(provided), digest(expected));
}

export function readRevalidateSecret(request: Request): string | null {
  const header = request.headers.get("x-revalidate-secret")?.trim();
  if (header) {
    return header;
  }

  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return null;
  }

  const match = /^Bearer\s+(\S+)\s*$/i.exec(authorization);
  return match?.[1] ?? null;
}

export function isSafeRevalidatePath(path: string): boolean {
  if (path.length < 1 || path.length > 200) {
    return false;
  }
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("\\") ||
    path.includes("..")
  ) {
    return false;
  }
  if (path.includes("?") || path.includes("#") || path.includes(" ")) {
    return false;
  }
  return /^\/[A-Za-z0-9\-._~%/[\]]*$/.test(path);
}

export type RevalidateBodyResult =
  | { ok: true; plan: RevalidatePlan }
  | { ok: false; status: number; error: string };

/**
 * Empty body refreshes every content tag and the known content routes.
 * `tags` narrows which data caches expire (allowlist only).
 * `paths` are added on top of the index and dynamic routes, so a single
 * new slug cannot leave the blog list or a previously cached 404 stale.
 */
export function parseRevalidateBody(payload: unknown): RevalidateBodyResult {
  if (payload == null) {
    return { ok: true, plan: defaultRevalidatePlan() };
  }

  if (typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, status: 400, error: "Invalid request." };
  }

  const record = payload as { tags?: unknown; paths?: unknown };
  const hasTags = Object.prototype.hasOwnProperty.call(record, "tags");
  const hasPaths = Object.prototype.hasOwnProperty.call(record, "paths");
  const fallback = defaultRevalidatePlan();

  let tags = fallback.tags;
  if (hasTags) {
    if (!Array.isArray(record.tags) || record.tags.some((tag) => typeof tag !== "string")) {
      return { ok: false, status: 400, error: "Invalid request." };
    }
    const allowed = record.tags.filter((tag) => ALLOWED_TAGS.has(tag));
    if (allowed.length !== record.tags.length || allowed.length === 0) {
      return { ok: false, status: 400, error: "Invalid request." };
    }
    tags = [...new Set(allowed)];
  }

  let paths = fallback.paths;
  if (hasPaths) {
    if (!Array.isArray(record.paths) || record.paths.some((path) => typeof path !== "string")) {
      return { ok: false, status: 400, error: "Invalid request." };
    }
    if (
      record.paths.length > MAX_PATHS ||
      record.paths.some((path) => !isSafeRevalidatePath(path))
    ) {
      return { ok: false, status: 400, error: "Invalid request." };
    }
    paths = [...new Set([...fallback.paths, ...record.paths])];
  }

  return {
    ok: true,
    plan: {
      tags,
      paths,
      dynamicPaths: fallback.dynamicPaths,
    },
  };
}

export async function readRevalidateBody(request: Request): Promise<RevalidateBodyResult> {
  const contentLength = Number(request.headers.get("content-length") ?? "");
  if (Number.isFinite(contentLength) && contentLength > MAX_REVALIDATE_BODY_CHARS) {
    return { ok: false, status: 413, error: "Invalid request." };
  }

  const text = await request.text();
  if (text.length > MAX_REVALIDATE_BODY_CHARS) {
    return { ok: false, status: 413, error: "Invalid request." };
  }
  if (!text.trim()) {
    return { ok: true, plan: defaultRevalidatePlan() };
  }

  try {
    return parseRevalidateBody(JSON.parse(text) as unknown);
  } catch {
    return { ok: false, status: 400, error: "Invalid request." };
  }
}

const inflight = new Map<string, Promise<unknown>>();

/**
 * Share one in-flight call across the process, then forget it.
 * Settled values and rejections are not retained, so a Notion error cannot
 * become a permanent cache entry the way the old module Maps did.
 */
export function singleflight<T>(key: string, task: () => Promise<T>): Promise<T> {
  const existing = inflight.get(key);
  if (existing) {
    return existing as Promise<T>;
  }

  const promise = task().finally(() => {
    if (inflight.get(key) === promise) {
      inflight.delete(key);
    }
  });
  inflight.set(key, promise);
  return promise;
}

export function resetSingleflightForTests() {
  inflight.clear();
}
