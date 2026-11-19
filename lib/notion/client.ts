import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";
import { NotionCompatAPI, convertPage } from "notion-compat";
import { parsePageId } from "notion-utils";

import { notionKey } from "@/lib/notion/config";
import { createRateLimitedFetch } from "@/lib/notion/rate-limited-fetch";

const rateLimitedFetch = createRateLimitedFetch();

export const notionAPI = new Client({
  auth: notionKey,
  // Single process-wide queue (concurrency 1 at build, 3 at runtime) + shared
  // 429 cooldown so notion-compat's blocks.children.list fan-out and
  // /blog/[slug] SSG do not stampede the public API. Retry-After sleeps happen
  // outside the Client's per-attempt ~60s fetch timeout window.
  fetch: rateLimitedFetch,
});

type ResolvedNotionPage = {
  blockMap: Record<string, unknown>;
  blockChildrenMap: Record<string, string[]>;
  pageMap: Record<string, unknown>;
  parentMap: Record<string, string>;
};

// notion-compat ships no type declarations; describe the parts used here.
const NotionCompatBase = NotionCompatAPI as unknown as new (client: Client) => {
  resolvePage(rootBlockId: string): Promise<ResolvedNotionPage>;
};

/**
 * notion-compat's getPage() fetches the page, the root block and all root
 * children, then resolvePage() fetches the root block, the page and the root
 * children again. Only the second set feeds the record map (the first is kept
 * on `recordMap.raw`, which nothing here reads), so skip it.
 */
export class DedupedNotionCompatAPI extends NotionCompatBase {
  async getPage(rawPageId: string) {
    const pageId = parsePageId(rawPageId);
    const { blockMap, blockChildrenMap, pageMap, parentMap } = await this.resolvePage(pageId);

    // resolvePage() logs and swallows per-block errors. The upstream getPage()
    // surfaced a failed root fetch through its own calls; keep that, so a
    // failed fetch is never cached as an empty page.
    if (!blockMap[pageId] || !blockChildrenMap[pageId]) {
      throw new Error(`Notion page ${pageId} could not be resolved`);
    }

    return convertPage({ pageId, blockMap, blockChildrenMap, pageMap, parentMap });
  }
}

// The unofficial notion-client scraper now 403s on page fetches in production.
// Prefer the official API through notion-compat whenever a token is available so
// blog/article pages can resolve again after deploy.
export const notionPrivateAPI = notionKey ? new DedupedNotionCompatAPI(notionAPI) : new NotionAPI();
