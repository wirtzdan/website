import { unstable_cache } from "next/cache";

import { CONTENT_REVALIDATE_SECONDS } from "@/lib/content-cache";

type PersistOptions = {
  revalidate?: number;
  tags: string[];
};

function isMissingIncrementalCache(error: unknown): boolean {
  return error instanceof Error && error.message.startsWith("Invariant: incrementalCache missing");
}

/**
 * Persist a successful result with Next's data cache.
 * The callback must throw on failure. `unstable_cache` stores the return
 * value and does not store a thrown error, so a null or a rejected Notion
 * call is never written. Outside a Next render (unit tests) the incremental
 * cache is absent and the loader runs directly.
 */
export function persist<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  keyParts: string[],
  options: PersistOptions,
): (...args: TArgs) => Promise<TResult> {
  const cached = unstable_cache(fn, keyParts, {
    revalidate: options.revalidate ?? CONTENT_REVALIDATE_SECONDS,
    tags: options.tags,
  });

  return async (...args) => {
    try {
      return await cached(...args);
    } catch (error) {
      if (isMissingIncrementalCache(error)) {
        return fn(...args);
      }
      throw error;
    }
  };
}
