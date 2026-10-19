/**
 * Guards for the public POST routes (/api/addSubscriber, /api/sendSuggestion).
 * Rate limiting prefers Upstash Redis so it holds across Vercel instances.
 * Without UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN, each instance
 * falls back to an in-memory window (fine for local dev, weak in production).
 */

import { HONEYPOT_FIELD } from "@/lib/honeypot";

export const GENERIC_UPSTREAM_ERROR = "Something went wrong. Please try again later.";
export const RATE_LIMIT_ERROR = "Too many requests. Please try again later.";
export const INVALID_REQUEST_ERROR = "Invalid request.";

export { HONEYPOT_FIELD };

export const MAX_BODY_BYTES = 16_384;
export const EMAIL_MAX_LENGTH = 254;
export const REFERRER_MAX_LENGTH = 2_048;
export const TITLE_MAX_LENGTH = 200;
export const AUTHOR_MAX_LENGTH = 200;
export const MESSAGE_MAX_LENGTH = 2_000;

export const SUBSCRIBE_LIMIT = 5;
export const SUBSCRIBE_WINDOW_SECONDS = 10 * 60;
export const SUGGESTION_LIMIT = 5;
export const SUGGESTION_WINDOW_SECONDS = 60 * 60;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type MemoryBucket = { count: number; resetAt: number };

const memoryBuckets = new Map<string, MemoryBucket>();
let warnedAboutFallback = false;

export function resetPublicApiRateLimitsForTests() {
  memoryBuckets.clear();
  warnedAboutFallback = false;
}

export function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const candidate =
    forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim() || "";
  const sanitized = candidate.replace(/[^a-zA-Z0-9:.]/g, "").slice(0, 64);
  return sanitized || "unknown";
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function honeypotTripped(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim().length > 0;
}

type StringFieldResult = { ok: true; value: string | undefined } | { ok: false; error: string };

export function readBoundedString(
  value: unknown,
  maxLength: number,
  options: { required?: boolean; label: string },
): StringFieldResult {
  if (value == null || value === "") {
    if (options.required) {
      return { ok: false, error: `${options.label} is required.` };
    }
    return { ok: true, value: undefined };
  }

  if (typeof value !== "string") {
    return { ok: false, error: INVALID_REQUEST_ERROR };
  }

  const trimmed = value.trim();
  if (!trimmed) {
    if (options.required) {
      return { ok: false, error: `${options.label} is required.` };
    }
    return { ok: true, value: undefined };
  }

  if (trimmed.length > maxLength) {
    return { ok: false, error: `${options.label} is too long.` };
  }

  return { ok: true, value: trimmed };
}

export function validateEmail(
  value: unknown,
): { ok: true; email: string } | { ok: false; error: string } {
  const parsed = readBoundedString(value, EMAIL_MAX_LENGTH, { required: true, label: "Email" });
  if (parsed.ok === false) {
    if (parsed.error === "Email is required." || parsed.error === INVALID_REQUEST_ERROR) {
      return { ok: false, error: parsed.error };
    }
    return { ok: false, error: "Enter a valid email address." };
  }
  if (!parsed.value || !EMAIL_PATTERN.test(parsed.value)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  return { ok: true, email: parsed.value };
}

export type SubscriberInput = {
  email: string;
  referrerUrl?: string;
};

export function parseSubscriber(
  body: Record<string, unknown>,
): { ok: true; value: SubscriberInput } | { ok: false; error: string } {
  if (body[HONEYPOT_FIELD] != null && typeof body[HONEYPOT_FIELD] !== "string") {
    return { ok: false, error: INVALID_REQUEST_ERROR };
  }

  const email = validateEmail(body.email);
  if (email.ok === false) {
    return { ok: false, error: email.error };
  }

  const referrer = readBoundedString(body.referrer_url, REFERRER_MAX_LENGTH, {
    label: "Referrer",
  });
  if (referrer.ok === false) {
    return { ok: false, error: referrer.error };
  }

  return {
    ok: true,
    value: { email: email.email, referrerUrl: referrer.value },
  };
}

export type SuggestionInput = {
  title: string;
  author: string;
  message?: string;
};

export function parseSuggestion(
  body: Record<string, unknown>,
): { ok: true; value: SuggestionInput } | { ok: false; error: string } {
  if (body[HONEYPOT_FIELD] != null && typeof body[HONEYPOT_FIELD] !== "string") {
    return { ok: false, error: INVALID_REQUEST_ERROR };
  }

  const title = readBoundedString(body.title, TITLE_MAX_LENGTH, { required: true, label: "Title" });
  if (title.ok === false) {
    return { ok: false, error: title.error };
  }
  if (!title.value) {
    return { ok: false, error: "Title is required." };
  }

  const author = readBoundedString(body.author, AUTHOR_MAX_LENGTH, {
    required: true,
    label: "Author",
  });
  if (author.ok === false) {
    return { ok: false, error: author.error };
  }
  if (!author.value) {
    return { ok: false, error: "Author is required." };
  }

  const message = readBoundedString(body.message, MESSAGE_MAX_LENGTH, { label: "Message" });
  if (message.ok === false) {
    return { ok: false, error: message.error };
  }

  return {
    ok: true,
    value: { title: title.value, author: author.value, message: message.value },
  };
}

function warnFallback(reason: string) {
  if (warnedAboutFallback) {
    return;
  }
  warnedAboutFallback = true;
  console.warn(
    `Distributed rate limit unavailable (${reason}). Using an in-memory fallback that does not span serverless instances.`,
  );
}

function hitMemory(key: string, limit: number, windowSeconds: number, now: number): boolean {
  const current = memoryBuckets.get(key);
  if (!current || now >= current.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return true;
  }

  current.count += 1;
  return current.count <= limit;
}

function readIncrCount(payload: unknown): number | null {
  const entries = Array.isArray(payload)
    ? payload
    : payload &&
        typeof payload === "object" &&
        Array.isArray((payload as { result?: unknown }).result)
      ? (payload as { result: unknown[] }).result
      : null;

  const first = entries?.[0];
  if (typeof first === "number") {
    return first;
  }
  if (
    first &&
    typeof first === "object" &&
    typeof (first as { result?: unknown }).result === "number"
  ) {
    return (first as { result: number }).result;
  }
  return null;
}

async function hitUpstash(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    warnFallback("UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is unset");
    return null;
  }

  try {
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, windowSeconds, "NX"],
      ]),
      signal: AbortSignal.timeout(2_000),
    });

    if (!response.ok) {
      console.error("Upstash rate limit request failed", response.status);
      warnFallback(`Upstash responded ${response.status}`);
      return null;
    }

    const count = readIncrCount(await response.json());
    if (count == null) {
      warnFallback("Upstash returned an unexpected payload");
      return null;
    }

    return count <= limit;
  } catch (error) {
    console.error("Upstash rate limit error", error);
    warnFallback("Upstash request failed");
    return null;
  }
}

export async function allowRequest(options: {
  scope: string;
  ip: string;
  limit: number;
  windowSeconds: number;
  now?: number;
}): Promise<boolean> {
  const key = `rl:v1:${options.scope}:${options.ip}`;
  const distributed = await hitUpstash(key, options.limit, options.windowSeconds);
  if (distributed != null) {
    return distributed;
  }
  return hitMemory(key, options.limit, options.windowSeconds, options.now ?? Date.now());
}

export type GuardResult =
  | { kind: "response"; response: Response }
  | { kind: "body"; body: Record<string, unknown> };

export async function guardPublicPost(
  request: Request,
  options: { scope: string; limit: number; windowSeconds: number; successStatus: number },
): Promise<GuardResult> {
  const contentLength = Number(request.headers.get("content-length") ?? "");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return {
      kind: "response",
      response: jsonResponse({ error: INVALID_REQUEST_ERROR }, 413),
    };
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return {
      kind: "response",
      response: jsonResponse({ error: INVALID_REQUEST_ERROR }, 400),
    };
  }

  if (!isPlainObject(payload)) {
    return {
      kind: "response",
      response: jsonResponse({ error: INVALID_REQUEST_ERROR }, 400),
    };
  }

  if (honeypotTripped(payload)) {
    console.info(`Honeypot tripped on ${options.scope}`);
    return {
      kind: "response",
      response: jsonResponse({ error: "" }, options.successStatus),
    };
  }

  const allowed = await allowRequest({
    scope: options.scope,
    ip: clientIp(request),
    limit: options.limit,
    windowSeconds: options.windowSeconds,
  });

  if (!allowed) {
    return {
      kind: "response",
      response: jsonResponse({ error: RATE_LIMIT_ERROR }, 429),
    };
  }

  return { kind: "body", body: payload };
}
