import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";
import { NotionCompatAPI } from "notion-compat";

import { notionKey } from "@/lib/notion/config";

export const notionAPI = new Client({ auth: notionKey });

// The unofficial notion-client scraper now 403s on page fetches in production.
// Prefer the official API through notion-compat whenever a token is available so
// blog/article pages can resolve again after deploy.
export const notionPrivateAPI = notionKey
  ? new NotionCompatAPI(notionAPI)
  : new NotionAPI();
