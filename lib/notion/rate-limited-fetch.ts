type NotionFetchInit = {
  agent?: unknown;
  body?: string;
  headers?: Record<string, string>;
  method?: string;
};

type NotionFetchResponse = {
  ok: boolean;
  text: () => Promise<string>;
  headers: unknown;
  status: number;
};

export type NotionFetch = (url: string, init?: NotionFetchInit) => Promise<NotionFetchResponse>;

/**
 * Max in-flight Notion HTTP requests process-wide.
 * Keep at 1 on Vercel/CI: notion-compat fans out `blocks.children.list`, and Next
 * prerenders many /blog/[slug] pages; even concurrency 2 stampedes the public API.
 */
export const NOTION_FETCH_CONCURRENCY = 1;

/** Attempts including the first try (HTTP layer). */
export const NOTION_FETCH_MAX_ATTEMPTS = 4;

/** Pace successful calls ~3 req/s to stay under Notion's public API average. */
export const NOTION_MIN_REQUEST_GAP_MS = 350;

const DEFAULT_RETRY_MS = 1000;
const MAX_RETRY_MS = 60_000;

export type RateLimitedFetchOptions = {
  concurrency?: number;
  maxAttempts?: number;
  minRequestGapMs?: number;
  /** Injected for tests. Defaults to global fetch. */
  fetchImpl?: NotionFetch;
  sleep?: (ms: number) => Promise<void>;
  /** Injected clock for tests. */
  now?: () => number;
};

export class Semaphore {
  private active = 0;
  private readonly waiters: Array<() => void> = [];

  constructor(private readonly max: number) {
    if (max < 1) {
      throw new Error("Semaphore max must be at least 1");
    }
  }

  get activeCount(): number {
    return this.active;
  }

  async run<T>(task: () => Promise<T>): Promise<T> {
    if (this.active >= this.max) {
      await new Promise<void>((resolve) => {
        this.waiters.push(resolve);
      });
    }

    this.active += 1;
    try {
      return await task();
    } finally {
      this.active -= 1;
      const next = this.waiters.shift();
      next?.();
    }
  }
}

/**
 * Process-wide cooldown after a 429 so every waiter shares one timer instead of
 * N independent Retry-After sleeps waking together and re-stamping the API.
 */
export class SharedCooldown {
  private coolUntilMs = 0;
  private pending: Promise<void> | null = null;

  constructor(
    private readonly sleep: (ms: number) => Promise<void>,
    private readonly now: () => number,
  ) {}

  get remainingMs(): number {
    return Math.max(0, this.coolUntilMs - this.now());
  }

  /** Extend the shared cooldown if `delayMs` reaches further than the current one. */
  extend(delayMs: number): void {
    const until = this.now() + Math.max(0, delayMs);
    if (until <= this.coolUntilMs) {
      return;
    }
    this.coolUntilMs = until;
  }

  /** Wait until the shared cooldown has elapsed (no-op if already clear). */
  async wait(): Promise<void> {
    while (this.remainingMs > 0) {
      if (!this.pending) {
        const waitMs = this.remainingMs;
        const target = this.coolUntilMs;
        this.pending = this.sleep(waitMs).finally(() => {
          this.pending = null;
          // Real clocks usually clear naturally; fake/instant sleeps need an explicit clear
          // so we do not spin forever when `now()` never advances.
          if (this.coolUntilMs <= target) {
            this.coolUntilMs = this.now();
          }
        });
      }
      await this.pending;
    }
  }
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function headerValue(headers: unknown, name: string): string | null {
  if (!headers) {
    return null;
  }

  if (typeof headers === "object" && typeof (headers as { get?: unknown }).get === "function") {
    return (headers as { get: (key: string) => string | null }).get(name);
  }

  if (typeof headers === "object") {
    const match = Object.entries(headers as Record<string, unknown>).find(
      ([key]) => key.toLowerCase() === name.toLowerCase(),
    );
    const value = match?.[1];
    return typeof value === "string" ? value : null;
  }

  return null;
}

/**
 * Prefer Retry-After / retry_after seconds. Falls back to exponential backoff with jitter.
 */
export function resolveRetryDelayMs(args: {
  attemptIndex: number;
  retryAfterHeader: string | null;
  bodyText?: string;
  random?: () => number;
}): number {
  const { attemptIndex, retryAfterHeader, bodyText, random = Math.random } = args;

  const fromHeader = parseRetryAfterSeconds(retryAfterHeader);
  if (fromHeader != null) {
    return clampRetryMs(fromHeader * 1000);
  }

  if (bodyText) {
    try {
      const parsed = JSON.parse(bodyText) as { retry_after?: string | number };
      const fromBody = parseRetryAfterSeconds(
        parsed.retry_after == null ? null : String(parsed.retry_after),
      );
      if (fromBody != null) {
        return clampRetryMs(fromBody * 1000);
      }
    } catch {
      // ignore non-JSON bodies
    }
  }

  const exponential = DEFAULT_RETRY_MS * 2 ** attemptIndex;
  const jitter = Math.floor(random() * 250);
  return clampRetryMs(exponential + jitter);
}

function parseRetryAfterSeconds(value: string | null): number | null {
  if (!value) {
    return null;
  }
  const asNumber = Number(value);
  if (Number.isFinite(asNumber) && asNumber >= 0) {
    return asNumber;
  }
  return null;
}

function clampRetryMs(ms: number): number {
  return Math.min(MAX_RETRY_MS, Math.max(0, Math.round(ms)));
}

function asNotionResponse(args: {
  ok: boolean;
  status: number;
  headers: unknown;
  bodyText: string;
}): NotionFetchResponse {
  return {
    ok: args.ok,
    status: args.status,
    headers: args.headers,
    text: async () => args.bodyText,
  };
}

type AttemptResult =
  | { kind: "ok"; response: NotionFetchResponse }
  | { kind: "cooldown" }
  | {
      kind: "rate_limited";
      response: NotionFetchResponse;
      bodyText: string;
      delayMs: number;
    };

/**
 * Notion Client wraps each `fetch` call in a ~60s timeout. Sleeps for Retry-After
 * must happen *outside* the concurrency slot and must not sit inside a single
 * timed `fetch` invocation — so we only hold the semaphore for the HTTP round-trip.
 *
 * After a 429, all callers share one cooldown (singleflight). Cooldown is checked
 * again *inside* the semaphore so the next waiter cannot sneak an HTTP call in
 * between "release slot" and "extend cooldown".
 */
export function createRateLimitedFetch(options: RateLimitedFetchOptions = {}): NotionFetch {
  const concurrency = options.concurrency ?? NOTION_FETCH_CONCURRENCY;
  const maxAttempts = options.maxAttempts ?? NOTION_FETCH_MAX_ATTEMPTS;
  const minRequestGapMs = options.minRequestGapMs ?? NOTION_MIN_REQUEST_GAP_MS;
  const fetchImpl =
    options.fetchImpl ??
    (async (url, init) => {
      const response = await globalThis.fetch(url, init as RequestInit);
      return response as unknown as NotionFetchResponse;
    });
  const sleep = options.sleep ?? defaultSleep;
  const now = options.now ?? Date.now;
  const semaphore = new Semaphore(concurrency);
  const cooldown = new SharedCooldown(sleep, now);
  let nextAllowedAtMs = 0;

  return async (url, init) => {
    let lastBodyText = "";
    let lastHeaders: unknown = undefined;
    let lastStatus = 429;
    let attempt = 0;

    while (attempt < maxAttempts) {
      await cooldown.wait();

      const gapMs = nextAllowedAtMs - now();
      if (gapMs > 0) {
        await sleep(gapMs);
      }

      const result: AttemptResult = await semaphore.run(async () => {
        // Another caller may have extended cooldown after we passed the outer wait
        // and before we acquired this slot — bail without hitting the network.
        if (cooldown.remainingMs > 0) {
          return { kind: "cooldown" };
        }

        const paceMs = nextAllowedAtMs - now();
        if (paceMs > 0) {
          // Do not sleep while holding the slot; retry the outer loop.
          return { kind: "cooldown" };
        }

        const response = await fetchImpl(url, init);
        nextAllowedAtMs = now() + minRequestGapMs;

        if (response.status !== 429) {
          return { kind: "ok", response };
        }

        const bodyText = await response.text();
        const delayMs = resolveRetryDelayMs({
          attemptIndex: attempt,
          retryAfterHeader: headerValue(response.headers, "retry-after"),
          bodyText,
        });
        // Extend before releasing the slot (still inside run) so the next waiter
        // observes remainingMs > 0 and does not sneak a request through.
        cooldown.extend(delayMs);
        return {
          kind: "rate_limited",
          response,
          bodyText,
          delayMs,
        };
      });

      if (result.kind === "cooldown") {
        continue;
      }

      if (result.kind === "ok") {
        return result.response;
      }

      lastBodyText = result.bodyText;
      lastHeaders = result.response.headers;
      lastStatus = result.response.status;
      attempt += 1;

      if (attempt >= maxAttempts) {
        break;
      }

      console.warn(
        `Notion API rate limited (429). Shared cooldown ${Math.ceil(cooldown.remainingMs / 1000)}s (attempt ${attempt}/${maxAttempts}).`,
      );
      await cooldown.wait();
    }

    return asNotionResponse({
      ok: false,
      status: lastStatus,
      headers: lastHeaders,
      bodyText: lastBodyText,
    });
  };
}

export type WithNotionRetryOptions = {
  maxAttempts?: number;
  sleep?: (ms: number) => Promise<void>;
  isRetryable?: (error: unknown) => boolean;
  getRetryDelayMs?: (error: unknown, attemptIndex: number) => number;
};

/**
 * Only retry client-side timeouts here. 429 / rate_limited are already exhausted
 * inside createRateLimitedFetch; retrying the whole getPage() multiplies sleeps
 * and pushes Next's per-page static generation past the page timeout.
 */
function defaultIsRetryable(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const candidate = error as { code?: string };
  return candidate.code === "notionhq_client_request_timeout";
}

function defaultRetryDelayFromError(error: unknown, attemptIndex: number): number {
  void error;
  return resolveRetryDelayMs({
    attemptIndex,
    retryAfterHeader: null,
    random: () => 0.5,
  });
}

/** Retry helper for call sites that throw Notion client errors (not raw fetch). */
export async function withNotionRetry<T>(
  task: () => Promise<T>,
  options: WithNotionRetryOptions = {},
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 2;
  const sleep = options.sleep ?? defaultSleep;
  const isRetryable = options.isRetryable ?? defaultIsRetryable;
  const getRetryDelayMs = options.getRetryDelayMs ?? defaultRetryDelayFromError;

  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (!isRetryable(error) || attempt === maxAttempts - 1) {
        throw error;
      }
      const delayMs = getRetryDelayMs(error, attempt);
      console.warn(
        `Notion API call failed (${error instanceof Error ? error.message : "unknown"}). Retrying in ${Math.ceil(delayMs / 1000)}s (attempt ${attempt + 1}/${maxAttempts}).`,
      );
      await sleep(delayMs);
    }
  }
  throw lastError;
}
