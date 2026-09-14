import { expect, test, vi } from "vite-plus/test";

import {
  Semaphore,
  createRateLimitedFetch,
  resolveRetryDelayMs,
  type NotionFetch,
} from "./rate-limited-fetch";

test("resolveRetryDelayMs prefers Retry-After header seconds", () => {
  expect(
    resolveRetryDelayMs({
      attemptIndex: 0,
      retryAfterHeader: "53",
      bodyText: JSON.stringify({ retry_after: "1" }),
    }),
  ).toBe(53_000);
});

test("resolveRetryDelayMs reads retry_after from JSON body", () => {
  expect(
    resolveRetryDelayMs({
      attemptIndex: 0,
      retryAfterHeader: null,
      bodyText: JSON.stringify({
        code: "rate_limited",
        rate_limit_reason: "public_api_request_rate_limit",
        retry_after: "12",
      }),
    }),
  ).toBe(12_000);
});

test("resolveRetryDelayMs falls back to exponential backoff", () => {
  expect(
    resolveRetryDelayMs({
      attemptIndex: 2,
      retryAfterHeader: null,
      random: () => 0,
    }),
  ).toBe(4000);
});

test("Semaphore caps concurrent runners", async () => {
  const semaphore = new Semaphore(2);
  let inFlight = 0;
  let maxInFlight = 0;

  const tasks = Array.from({ length: 6 }, () =>
    semaphore.run(async () => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 20));
      inFlight -= 1;
    }),
  );

  await Promise.all(tasks);
  expect(maxInFlight).toBe(2);
});

test("createRateLimitedFetch retries 429 using retry-after then succeeds", async () => {
  const sleeps: number[] = [];
  let calls = 0;

  const fetchImpl: NotionFetch = async () => {
    calls += 1;
    if (calls < 3) {
      return {
        ok: false,
        status: 429,
        headers: { "retry-after": "0.01" },
        text: async () =>
          JSON.stringify({
            code: "rate_limited",
            retry_after: "0.01",
          }),
      };
    }
    return {
      ok: true,
      status: 200,
      headers: {},
      text: async () => JSON.stringify({ ok: true }),
    };
  };

  const fetch = createRateLimitedFetch({
    concurrency: 1,
    maxAttempts: 5,
    fetchImpl,
    sleep: async (ms) => {
      sleeps.push(ms);
    },
  });

  const response = await fetch("https://api.notion.com/v1/pages/abc");
  expect(response.status).toBe(200);
  expect(calls).toBe(3);
  expect(sleeps.length).toBe(2);
  expect(sleeps[0]).toBe(10);
});

test("createRateLimitedFetch returns final 429 body after exhausting retries", async () => {
  const fetchImpl: NotionFetch = async () => ({
    ok: false,
    status: 429,
    headers: { "retry-after": "1" },
    text: async () => JSON.stringify({ code: "rate_limited", retry_after: "1" }),
  });

  const fetch = createRateLimitedFetch({
    concurrency: 1,
    maxAttempts: 2,
    fetchImpl,
    sleep: async () => undefined,
  });

  const response = await fetch("https://api.notion.com/v1/pages/abc");
  expect(response.status).toBe(429);
  expect(await response.text()).toContain("rate_limited");
});

test("createRateLimitedFetch serializes work beyond concurrency", async () => {
  let inFlight = 0;
  let maxInFlight = 0;

  const fetchImpl: NotionFetch = async () => {
    inFlight += 1;
    maxInFlight = Math.max(maxInFlight, inFlight);
    await new Promise((resolve) => setTimeout(resolve, 15));
    inFlight -= 1;
    return {
      ok: true,
      status: 200,
      headers: {},
      text: async () => "{}",
    };
  };

  const fetch = createRateLimitedFetch({
    concurrency: 2,
    fetchImpl,
    sleep: async () => undefined,
  });

  await Promise.all([
    fetch("https://api.notion.com/1"),
    fetch("https://api.notion.com/2"),
    fetch("https://api.notion.com/3"),
    fetch("https://api.notion.com/4"),
  ]);

  expect(maxInFlight).toBe(2);
});

test("createRateLimitedFetch does not retry non-429 failures", async () => {
  const fetchImpl = vi.fn<NotionFetch>(async () => ({
    ok: false,
    status: 500,
    headers: {},
    text: async () => "server error",
  }));

  const fetch = createRateLimitedFetch({
    concurrency: 1,
    fetchImpl,
    sleep: async () => undefined,
  });

  const response = await fetch("https://api.notion.com/v1/pages/abc");
  expect(response.status).toBe(500);
  expect(fetchImpl).toHaveBeenCalledTimes(1);
});
