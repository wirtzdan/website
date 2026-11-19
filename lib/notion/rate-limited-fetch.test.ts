import { expect, test, vi } from "vite-plus/test";

import {
  NEXT_PRODUCTION_BUILD_PHASE,
  NOTION_MIN_REQUEST_GAP_MS,
  Semaphore,
  SharedCooldown,
  createRateLimitedFetch,
  notionPacingForPhase,
  resolveRetryDelayMs,
  withNotionRetry,
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

test("SharedCooldown extends to the furthest deadline and clears waiters once", async () => {
  let now = 1_000;
  const sleeps: number[] = [];
  const cooldown = new SharedCooldown(
    async (ms) => {
      sleeps.push(ms);
      now += ms;
    },
    () => now,
  );

  cooldown.extend(5_000);
  cooldown.extend(2_000);
  expect(cooldown.remainingMs).toBe(5_000);

  await cooldown.wait();
  expect(cooldown.remainingMs).toBe(0);
  expect(sleeps).toEqual([5_000]);
});

test("createRateLimitedFetch retries 429 using retry-after then succeeds", async () => {
  const sleeps: number[] = [];
  let now = 0;
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
    minRequestGapMs: 0,
    minStartIntervalMs: 0,
    fetchImpl,
    now: () => now,
    sleep: async (ms) => {
      sleeps.push(ms);
      now += ms;
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
    minRequestGapMs: 0,
    minStartIntervalMs: 0,
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
    minRequestGapMs: 0,
    minStartIntervalMs: 0,
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
    minRequestGapMs: 0,
    minStartIntervalMs: 0,
    fetchImpl,
    sleep: async () => undefined,
  });

  const response = await fetch("https://api.notion.com/v1/pages/abc");
  expect(response.status).toBe(500);
  expect(fetchImpl).toHaveBeenCalledTimes(1);
});

test("createRateLimitedFetch does not sneak HTTP calls through during shared cooldown", async () => {
  let now = 0;
  let calls = 0;
  const sleepGates: Array<() => void> = [];

  const fetchImpl: NotionFetch = async () => {
    calls += 1;
    if (calls === 1) {
      return {
        ok: false,
        status: 429,
        headers: { "retry-after": "30" },
        text: async () => JSON.stringify({ retry_after: "30" }),
      };
    }
    return {
      ok: true,
      status: 200,
      headers: {},
      text: async () => "{}",
    };
  };

  const fetch = createRateLimitedFetch({
    concurrency: 1,
    maxAttempts: 3,
    minRequestGapMs: 0,
    minStartIntervalMs: 0,
    fetchImpl,
    now: () => now,
    sleep: () =>
      new Promise<void>((resolve) => {
        sleepGates.push(() => {
          now += 30_000;
          resolve();
        });
      }),
  });

  const first = fetch("https://api.notion.com/1");
  await vi.waitFor(() => {
    expect(sleepGates.length).toBe(1);
  });

  const second = fetch("https://api.notion.com/2");
  // While first is in shared cooldown, second must not open another HTTP call.
  await new Promise((resolve) => setTimeout(resolve, 20));
  expect(calls).toBe(1);

  sleepGates[0]!();
  await Promise.all([first, second]);
  expect(calls).toBeGreaterThanOrEqual(2);
});

test("createRateLimitedFetch shares one cooldown across concurrent 429s", async () => {
  let now = 0;
  const sleeps: number[] = [];
  let calls = 0;

  const fetchImpl: NotionFetch = async () => {
    calls += 1;
    if (calls <= 2) {
      return {
        ok: false,
        status: 429,
        headers: { "retry-after": "30" },
        text: async () => JSON.stringify({ retry_after: "30" }),
      };
    }
    return {
      ok: true,
      status: 200,
      headers: {},
      text: async () => "{}",
    };
  };

  const fetch = createRateLimitedFetch({
    concurrency: 2,
    maxAttempts: 3,
    minRequestGapMs: 0,
    minStartIntervalMs: 0,
    fetchImpl,
    now: () => now,
    sleep: async (ms) => {
      sleeps.push(ms);
      now += ms;
    },
  });

  const results = await Promise.all([
    fetch("https://api.notion.com/a"),
    fetch("https://api.notion.com/b"),
  ]);

  expect(results.every((response) => response.status === 200)).toBe(true);
  const totalSleep = sleeps.reduce((sum, ms) => sum + ms, 0);
  expect(totalSleep).toBeLessThan(90_000);
  expect(Math.max(...sleeps, 0)).toBe(30_000);
});

type Timeline = { starts: number[]; ends: number[]; maxInFlight: number; rateLimitedAt?: number };

/**
 * Fake clock: sleeps advance `now`, and each HTTP call takes `latencyMs` of
 * fake time (plus a real tick so calls overlap). Records start and end times.
 */
function pacedHarness(latencyMs: number, statusFor: (call: number) => number = () => 200) {
  let now = 0;
  let inFlight = 0;
  let calls = 0;
  const timeline: Timeline = { starts: [], ends: [], maxInFlight: 0 };

  const fetchImpl: NotionFetch = async () => {
    calls += 1;
    const status = statusFor(calls);
    timeline.starts.push(now);
    inFlight += 1;
    timeline.maxInFlight = Math.max(timeline.maxInFlight, inFlight);
    await new Promise((resolve) => setTimeout(resolve, 5));
    now += latencyMs;
    inFlight -= 1;
    timeline.ends.push(now);
    if (status === 429) {
      timeline.rateLimitedAt = now;
    }
    return {
      ok: status === 200,
      status,
      headers: status === 429 ? { "retry-after": "30" } : {},
      text: async () => (status === 429 ? JSON.stringify({ retry_after: "30" }) : "{}"),
    };
  };

  return {
    timeline,
    options: {
      fetchImpl,
      now: () => now,
      sleep: async (ms: number) => {
        now += ms;
      },
    },
  };
}

test("notionPacingForPhase keeps the build serial and allows 3 in flight at runtime", () => {
  expect(notionPacingForPhase(NEXT_PRODUCTION_BUILD_PHASE)).toEqual({
    concurrency: 1,
    minRequestGapMs: NOTION_MIN_REQUEST_GAP_MS,
    minStartIntervalMs: 0,
  });
  for (const phase of [undefined, "phase-development-server", "phase-production-server"]) {
    expect(notionPacingForPhase(phase)).toEqual({
      concurrency: 3,
      minRequestGapMs: 0,
      minStartIntervalMs: NOTION_MIN_REQUEST_GAP_MS,
    });
  }
});

test("createRateLimitedFetch at build runs one call at a time with a gap after each response", async () => {
  const { timeline, options } = pacedHarness(250);
  const fetch = createRateLimitedFetch({ ...options, phase: NEXT_PRODUCTION_BUILD_PHASE });

  await Promise.all(Array.from({ length: 5 }, (_, i) => fetch(`https://api.notion.com/${i}`)));

  expect(timeline.maxInFlight).toBe(1);
  for (let i = 1; i < timeline.starts.length; i += 1) {
    expect(timeline.starts[i]! - timeline.ends[i - 1]!).toBeGreaterThanOrEqual(
      NOTION_MIN_REQUEST_GAP_MS,
    );
  }
});

test("createRateLimitedFetch at runtime overlaps up to 3 calls with spaced starts", async () => {
  const { timeline, options } = pacedHarness(1_000);
  const fetch = createRateLimitedFetch({ ...options, phase: undefined });

  await Promise.all(Array.from({ length: 9 }, (_, i) => fetch(`https://api.notion.com/${i}`)));

  expect(timeline.starts).toHaveLength(9);
  expect(timeline.maxInFlight).toBe(3);
  const sortedStarts = [...timeline.starts].sort((a, b) => a - b);
  for (let i = 1; i < sortedStarts.length; i += 1) {
    expect(sortedStarts[i]! - sortedStarts[i - 1]!).toBeGreaterThanOrEqual(
      NOTION_MIN_REQUEST_GAP_MS,
    );
  }
});

test("createRateLimitedFetch at runtime holds every caller during a shared 429 cooldown", async () => {
  const { timeline, options } = pacedHarness(100, (call) => (call === 1 ? 429 : 200));
  const fetch = createRateLimitedFetch({ ...options, phase: undefined });

  const responses = await Promise.all(
    Array.from({ length: 4 }, (_, i) => fetch(`https://api.notion.com/${i}`)),
  );

  expect(responses.every((response) => response.status === 200)).toBe(true);
  const rateLimitedAt = timeline.rateLimitedAt!;
  expect(rateLimitedAt).toBeDefined();
  const startedDuringCooldown = timeline.starts.filter(
    (start) => start > rateLimitedAt && start < rateLimitedAt + 30_000,
  );
  expect(startedDuringCooldown).toEqual([]);
});

test("withNotionRetry retries timeouts but not rate_limited (HTTP layer owns 429s)", async () => {
  const sleeps: number[] = [];
  let calls = 0;

  const result = await withNotionRetry(
    async () => {
      calls += 1;
      if (calls === 1) {
        throw Object.assign(new Error("timed out"), {
          code: "notionhq_client_request_timeout",
        });
      }
      return "ok";
    },
    {
      sleep: async (ms) => {
        sleeps.push(ms);
      },
    },
  );

  expect(result).toBe("ok");
  expect(calls).toBe(2);
  expect(sleeps.length).toBe(1);

  await expect(
    withNotionRetry(
      async () => {
        throw Object.assign(new Error("rate limited"), {
          code: "rate_limited",
          status: 429,
        });
      },
      { sleep: async () => undefined, maxAttempts: 3 },
    ),
  ).rejects.toMatchObject({ code: "rate_limited" });
});
