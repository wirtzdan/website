import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";
import { NotionCompatAPI } from "notion-compat";

import { notionKey } from "@/lib/notion/config";
import { createRateLimitedFetch } from "@/lib/notion/rate-limited-fetch";

const rateLimitedFetch = createRateLimitedFetch();

export const notionAPI = new Client({
  auth: notionKey,
  // Single process-wide queue (concurrency 1) + shared 429 cooldown so
  // notion-compat's blocks.children.list fan-out and /blog/[slug] SSG do not
  // stampede the public API. Retry-After sleeps happen outside the Client's
  // per-attempt ~60s fetch timeout window.
  fetch: rateLimitedFetch,
});

// The unofficial notion-client scraper now 403s on page fetches in production.
// Prefer the official API through notion-compat whenever a token is available so
// blog/article pages can resolve again after deploy.
export const notionPrivateAPI = notionKey ? new NotionCompatAPI(notionAPI) : new NotionAPI();
