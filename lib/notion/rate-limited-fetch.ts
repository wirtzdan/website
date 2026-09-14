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

/** Max in-flight Notion HTTP requests process-wide (build prerender fan-out). */
export const NOTION_FETCH_CONCURRENCY = 2;

/** Attempts including the first try. */
export const NOTION_FETCH_MAX_ATTEMPTS = 6;

const DEFAULT_RETRY_MS = 1000;
const MAX_RETRY_MS = 60_000;

export type RateLimitedFetchOptions = {
  concurrency?: number;
  maxAttempts?: number;
  /** Injected for tests. Defaults to global fetch. */
  fetchImpl?: NotionFetch;
  sleep?: (ms: number) => Promise<void>;
};

export class Semaphore {
  private active = 0;
  private readonly waiters: Array<() => void> = [];

  constructor(private readonly max: number) {
    if (max < 1) {
      throw new Error("Semaphore max must be at least 1");
    }
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
    const value = (headers as { get: (key: string) => string | null }).get(name);
    return value;
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

export function createRateLimitedFetch(options: RateLimitedFetchOptions = {}): NotionFetch {
  const concurrency = options.concurrency ?? NOTION_FETCH_CONCURRENCY;
  const maxAttempts = options.maxAttempts ?? NOTION_FETCH_MAX_ATTEMPTS;
  const fetchImpl =
    options.fetchImpl ??
    (async (url, init) => {
      const response = await globalThis.fetch(url, init as RequestInit);
      return response as unknown as NotionFetchResponse;
    });
  const sleep = options.sleep ?? defaultSleep;
  const semaphore = new Semaphore(concurrency);

  return async (url, init) => {
    return semaphore.run(async () => {
      let lastBodyText = "";
      let lastHeaders: unknown = undefined;
      let lastStatus = 429;

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const response = await fetchImpl(url, init);

        if (response.status !== 429) {
          return response;
        }

        // Consume body once so we can honor retry_after and still rebuild a
        // response for the Notion client on the final attempt.
        lastBodyText = await response.text();
        lastHeaders = response.headers;
        lastStatus = response.status;

        if (attempt === maxAttempts - 1) {
          break;
        }

        const delayMs = resolveRetryDelayMs({
          attemptIndex: attempt,
          retryAfterHeader: headerValue(response.headers, "retry-after"),
          bodyText: lastBodyText,
        });

        console.warn(
          `Notion API rate limited (429). Retrying in ${Math.ceil(delayMs / 1000)}s (attempt ${attempt + 1}/${maxAttempts}).`,
        );
        await sleep(delayMs);
      }

      return asNotionResponse({
        ok: false,
        status: lastStatus,
        headers: lastHeaders,
        bodyText: lastBodyText,
      });
    });
  };
}
