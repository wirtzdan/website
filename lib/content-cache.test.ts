import { afterEach, expect, test } from "vite-plus/test";

import {
  CONTENT_CACHE_TAGS,
  CONTENT_DYNAMIC_PATHS,
  CONTENT_INDEX_PATHS,
  CONTENT_REVALIDATE_SECONDS,
  defaultRevalidatePlan,
  isSafeRevalidatePath,
  parseRevalidateBody,
  readRevalidateSecret,
  resetSingleflightForTests,
  secretsMatch,
  singleflight,
} from "./content-cache";

afterEach(() => {
  resetSingleflightForTests();
});

test("the hourly window matches the route segment literal", () => {
  expect(CONTENT_REVALIDATE_SECONDS).toBe(3600);
});

test("secretsMatch compares digests and rejects a missing secret", () => {
  expect(secretsMatch("correct horse", "correct horse")).toBe(true);
  expect(secretsMatch("correct horse", "correct horses")).toBe(false);
  expect(secretsMatch("short", "correct horse battery staple")).toBe(false);
  expect(secretsMatch(null, "correct horse")).toBe(false);
  expect(secretsMatch("correct horse", undefined)).toBe(false);
  expect(secretsMatch("", "correct horse")).toBe(false);
});

test("readRevalidateSecret accepts the header or a bearer token", () => {
  const header = new Request("https://danielwirtz.com/api/revalidate", {
    headers: { "x-revalidate-secret": " from-header " },
  });
  expect(readRevalidateSecret(header)).toBe("from-header");

  const bearer = new Request("https://danielwirtz.com/api/revalidate", {
    headers: { Authorization: "Bearer from-bearer" },
  });
  expect(readRevalidateSecret(bearer)).toBe("from-bearer");

  const neither = new Request("https://danielwirtz.com/api/revalidate");
  expect(readRevalidateSecret(neither)).toBeNull();
});

test("an empty body refreshes every content tag and the content routes", () => {
  expect(parseRevalidateBody(null)).toEqual({ ok: true, plan: defaultRevalidatePlan() });
  expect(parseRevalidateBody({})).toEqual({ ok: true, plan: defaultRevalidatePlan() });
  expect(defaultRevalidatePlan().tags).toContain(CONTENT_CACHE_TAGS.blog);
  expect(defaultRevalidatePlan().paths).toEqual([...CONTENT_INDEX_PATHS]);
  expect(defaultRevalidatePlan().dynamicPaths).toEqual([...CONTENT_DYNAMIC_PATHS]);
});

test("a slug path is added and the index routes stay in the plan", () => {
  const parsed = parseRevalidateBody({ paths: ["/blog/new-post"] });
  expect(parsed.ok).toBe(true);
  if (!parsed.ok) {
    return;
  }
  expect(parsed.plan.paths).toContain("/");
  expect(parsed.plan.paths).toContain("/blog");
  expect(parsed.plan.paths).toContain("/blog/new-post");
  expect(parsed.plan.dynamicPaths).toContain("/blog/[slug]");
  expect(parsed.plan.tags).toContain(CONTENT_CACHE_TAGS.all);
});

test("rejects unknown tags and unsafe paths", () => {
  expect(parseRevalidateBody({ tags: ["not-a-tag"] }).ok).toBe(false);
  expect(parseRevalidateBody({ paths: ["https://evil.example/steal"] }).ok).toBe(false);
  expect(parseRevalidateBody({ paths: ["/../etc/passwd"] }).ok).toBe(false);
  expect(parseRevalidateBody({ paths: ["//evil.example"] }).ok).toBe(false);
  expect(isSafeRevalidatePath("/blog/a-post")).toBe(true);
});

test("narrows tags to the allowlist when the caller names them", () => {
  const parsed = parseRevalidateBody({ tags: [CONTENT_CACHE_TAGS.blog, CONTENT_CACHE_TAGS.blog] });
  expect(parsed.ok).toBe(true);
  if (!parsed.ok) {
    return;
  }
  expect(parsed.plan.tags).toEqual([CONTENT_CACHE_TAGS.blog]);
});

test("singleflight shares one in-flight call and forgets the result", async () => {
  let calls = 0;
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });

  const run = () =>
    singleflight("posts", async () => {
      calls += 1;
      await gate;
      return "ok";
    });

  const first = run();
  const second = run();
  release();
  await expect(Promise.all([first, second])).resolves.toEqual(["ok", "ok"]);
  expect(calls).toBe(1);

  await expect(run()).resolves.toBe("ok");
  expect(calls).toBe(2);
});

test("singleflight does not retain a rejection or a null", async () => {
  let failures = 0;
  const fail = () =>
    singleflight("fail", async () => {
      failures += 1;
      throw new Error("notion down");
    });

  await expect(fail()).rejects.toThrow("notion down");
  await expect(fail()).rejects.toThrow("notion down");
  expect(failures).toBe(2);

  let nulls = 0;
  const empty = () =>
    singleflight("empty", async () => {
      nulls += 1;
      return null;
    });

  await expect(empty()).resolves.toBeNull();
  await expect(empty()).resolves.toBeNull();
  expect(nulls).toBe(2);
});
