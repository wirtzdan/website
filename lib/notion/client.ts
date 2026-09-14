import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";
import { NotionCompatAPI } from "notion-compat";

import { notionKey } from "@/lib/notion/config";
import { createRateLimitedFetch } from "@/lib/notion/rate-limited-fetch";

const rateLimitedFetch = createRateLimitedFetch();

export const notionAPI = new Client({
  auth: notionKey,
  // Throttle + retry 429s at the HTTP layer so notion-compat's fan-out and
  // Next's parallel /blog/[slug] prerender don't trip the public API limit.
  fetch: rateLimitedFetch,
});

// The unofficial notion-client scraper now 403s on page fetches in production.
// Prefer the official API through notion-compat whenever a token is available so
// blog/article pages can resolve again after deploy.
export const notionPrivateAPI = notionKey ? new NotionCompatAPI(notionAPI) : new NotionAPI();
