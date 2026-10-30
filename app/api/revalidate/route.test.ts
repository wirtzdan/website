import { afterEach, expect, test, vi } from "vite-plus/test";

import { revalidatePath, revalidateTag } from "next/cache";

import {
  CONTENT_CACHE_TAGS,
  CONTENT_DYNAMIC_PATHS,
  CONTENT_INDEX_PATHS,
} from "@/lib/content-cache";
import { resetPublicApiRateLimitsForTests } from "@/lib/public-api";

import { POST } from "./route";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

afterEach(() => {
  resetPublicApiRateLimitsForTests();
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

function post(body?: unknown, secret = "test-secret") {
  return new Request("https://danielwirtz.com/api/revalidate", {
    method: "POST",
    headers: {
      authorization: `Bearer ${secret}`,
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.50",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

test("refuses the call when the secret is unset or wrong", async () => {
  vi.stubEnv("REVALIDATE_SECRET", "");
  const missing = await POST(post(undefined, "anything"));
  expect(missing.status).toBe(401);
  expect(revalidateTag).not.toHaveBeenCalled();

  vi.stubEnv("REVALIDATE_SECRET", "test-secret");
  const wrong = await POST(post({}, "nope"));
  expect(wrong.status).toBe(401);
  expect(revalidateTag).not.toHaveBeenCalled();
  expect(revalidatePath).not.toHaveBeenCalled();
});

test("expires every content tag and the content routes", async () => {
  vi.stubEnv("REVALIDATE_SECRET", "test-secret");
  const response = await POST(post());
  expect(response.status).toBe(200);

  const body = (await response.json()) as { revalidated: boolean; tags: string[]; paths: string[] };
  expect(body.revalidated).toBe(true);
  expect(body.tags).toContain(CONTENT_CACHE_TAGS.blog);
  expect(body.tags).toContain(CONTENT_CACHE_TAGS.bookmarks);

  for (const tag of Object.values(CONTENT_CACHE_TAGS)) {
    expect(revalidateTag).toHaveBeenCalledWith(tag, { expire: 0 });
  }
  for (const path of CONTENT_INDEX_PATHS) {
    expect(revalidatePath).toHaveBeenCalledWith(path);
  }
  for (const path of CONTENT_DYNAMIC_PATHS) {
    expect(revalidatePath).toHaveBeenCalledWith(path, "page");
  }
  expect(response.headers.get("cache-control")).toBe("no-store");
});

test("accepts the secret header and an extra slug", async () => {
  vi.stubEnv("REVALIDATE_SECRET", "test-secret");
  const request = new Request("https://danielwirtz.com/api/revalidate", {
    method: "POST",
    headers: {
      "x-revalidate-secret": "test-secret",
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.51",
    },
    body: JSON.stringify({ paths: ["/blog/new-post"], tags: [CONTENT_CACHE_TAGS.blog] }),
  });

  const response = await POST(request);
  expect(response.status).toBe(200);
  expect(revalidateTag).toHaveBeenCalledTimes(1);
  expect(revalidateTag).toHaveBeenCalledWith(CONTENT_CACHE_TAGS.blog, { expire: 0 });
  expect(revalidatePath).toHaveBeenCalledWith("/blog/new-post");
  expect(revalidatePath).toHaveBeenCalledWith("/blog/[slug]", "page");
});

test("rejects an unknown tag without touching the cache", async () => {
  vi.stubEnv("REVALIDATE_SECRET", "test-secret");
  const response = await POST(post({ tags: ["users"] }));
  expect(response.status).toBe(400);
  expect(revalidateTag).not.toHaveBeenCalled();
});
