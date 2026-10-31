import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

import { POST as postSubscriber } from "../app/api/addSubscriber/route";
import { POST as postSuggestion } from "../app/api/sendSuggestion/route";
import {
  EMAIL_MAX_LENGTH,
  GENERIC_UPSTREAM_ERROR,
  HONEYPOT_FIELD,
  INVALID_REQUEST_ERROR,
  RATE_LIMIT_ERROR,
  SUBSCRIBE_LIMIT,
  clientIp,
  parseSubscriber,
  parseSuggestion,
  resetPublicApiRateLimitsForTests,
} from "@/lib/public-api";

beforeEach(() => {
  vi.stubEnv("BUTTONDOWN_API_KEY", "test-buttondown-key");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", undefined);
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", undefined);
});

afterEach(() => {
  resetPublicApiRateLimitsForTests();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

function post(path: string, body: unknown, ip = "203.0.113.10") {
  return new Request(`https://danielwirtz.com${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": `${ip}, 10.0.0.1`,
    },
    body: JSON.stringify(body),
  });
}

test("client IP uses the first x-forwarded-for hop, then x-real-ip", () => {
  const forwarded = new Request("https://danielwirtz.com/api/addSubscriber", {
    headers: { "x-forwarded-for": "203.0.113.8, 10.0.0.2", "x-real-ip": "198.51.100.4" },
  });
  expect(clientIp(forwarded)).toBe("203.0.113.8");

  const realIp = new Request("https://danielwirtz.com/api/addSubscriber", {
    headers: { "x-real-ip": "198.51.100.4" },
  });
  expect(clientIp(realIp)).toBe("198.51.100.4");

  expect(clientIp(new Request("https://danielwirtz.com/api/addSubscriber"))).toBe("unknown");
});

test("subscriber validation rejects bad types, bad emails, and oversized fields", () => {
  expect(parseSubscriber({ email: "ada@example.com" })).toEqual({
    ok: true,
    value: { email: "ada@example.com", referrerUrl: undefined },
  });
  expect(parseSubscriber({ email: "not-an-email" }).ok).toBe(false);
  expect(parseSubscriber({ email: 12 }).ok).toBe(false);
  expect(parseSubscriber({ email: "ada@example.com", referrer_url: 4 }).ok).toBe(false);
  expect(parseSubscriber({ email: `${"a".repeat(EMAIL_MAX_LENGTH)}@example.com` }).ok).toBe(false);
  expect(parseSubscriber({ email: "ada@example.com", [HONEYPOT_FIELD]: { filled: true } }).ok).toBe(
    false,
  );
});

test("suggestion validation enforces strings and max lengths", () => {
  expect(parseSuggestion({ title: "Dune", author: "Frank Herbert", message: "Great." })).toEqual({
    ok: true,
    value: { title: "Dune", author: "Frank Herbert", message: "Great." },
  });
  expect(parseSuggestion({ title: "  ", author: "Frank Herbert" }).ok).toBe(false);
  expect(parseSuggestion({ title: "Dune", author: ["Frank"] }).ok).toBe(false);
  expect(
    parseSuggestion({ title: "Dune", author: "Frank Herbert", message: "x".repeat(2001) }).ok,
  ).toBe(false);
});

test("addSubscriber honeypot returns success and does not call Buttondown", async () => {
  const fetchMock = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));
  const response = await postSubscriber(
    post("/api/addSubscriber", { email: "ada@example.com", [HONEYPOT_FIELD]: "https://spam.test" }),
  );

  expect(response.status).toBe(201);
  expect(await response.json()).toEqual({ error: "" });
  expect(fetchMock).not.toHaveBeenCalled();
});

test("addSubscriber rejects a non-object body", async () => {
  const response = await postSubscriber(post("/api/addSubscriber", ["ada@example.com"]));
  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ error: INVALID_REQUEST_ERROR });
});

test("addSubscriber hides upstream error bodies", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify({ error: "raw buttondown failure", detail: "secret" }), {
      status: 400,
    }),
  );

  const response = await postSubscriber(
    post("/api/addSubscriber", { email: "ada@example.com" }, "203.0.113.20"),
  );
  const body = await response.json();

  expect(response.status).toBe(502);
  expect(body).toEqual({ error: GENERIC_UPSTREAM_ERROR });
});

test("addSubscriber rate limits a single IP", async () => {
  const fetchMock = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(new Response("{}", { status: 200 }));

  for (let attempt = 0; attempt < SUBSCRIBE_LIMIT; attempt += 1) {
    const response = await postSubscriber(
      post("/api/addSubscriber", { email: `ada${attempt}@example.com` }, "203.0.113.30"),
    );
    expect(response.status).toBe(201);
  }

  const blocked = await postSubscriber(
    post("/api/addSubscriber", { email: "ada@example.com" }, "203.0.113.30"),
  );
  expect(blocked.status).toBe(429);
  expect(await blocked.json()).toEqual({ error: RATE_LIMIT_ERROR });
  expect(fetchMock).toHaveBeenCalledTimes(SUBSCRIBE_LIMIT);
});

test("sendSuggestion hides Airtable failures", async () => {
  const previousKey = process.env.AIRTABLE_API_KEY;
  const previousBase = process.env.AIRTABLE_BASE_ID;
  delete process.env.AIRTABLE_API_KEY;
  delete process.env.AIRTABLE_BASE_ID;

  try {
    const response = await postSuggestion(
      post("/api/sendSuggestion", { title: "Dune", author: "Frank Herbert" }, "203.0.113.40"),
    );
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body).toEqual({ error: GENERIC_UPSTREAM_ERROR });
    expect(JSON.stringify(body).toLowerCase()).not.toContain("airtable");
  } finally {
    if (previousKey == null) {
      delete process.env.AIRTABLE_API_KEY;
    } else {
      process.env.AIRTABLE_API_KEY = previousKey;
    }
    if (previousBase == null) {
      delete process.env.AIRTABLE_BASE_ID;
    } else {
      process.env.AIRTABLE_BASE_ID = previousBase;
    }
  }
});

test("sendSuggestion honeypot returns success without Airtable", async () => {
  const previousKey = process.env.AIRTABLE_API_KEY;
  delete process.env.AIRTABLE_API_KEY;

  try {
    const response = await postSuggestion(
      post(
        "/api/sendSuggestion",
        { title: "Dune", author: "Frank Herbert", [HONEYPOT_FIELD]: "bot" },
        "203.0.113.41",
      ),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ error: "" });
  } finally {
    if (previousKey == null) {
      delete process.env.AIRTABLE_API_KEY;
    } else {
      process.env.AIRTABLE_API_KEY = previousKey;
    }
  }
});
