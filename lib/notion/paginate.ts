/** Notion's public API rejects page_size above 100. */
export const NOTION_DATABASE_PAGE_SIZE = 100;

/** Stop a cursor loop well before a page render can spend a minute paging. */
const MAX_PAGES = 50;

export type NotionPage<T> = {
  items: T[];
  hasMore: boolean;
  nextCursor: string | null;
};

/**
 * Walk a Notion database one page at a time.
 * Callers must await this; do not fan the pages out with Promise.all.
 * The shared Notion fetch queue is concurrency 1, and a parallel burst is
 * what produces 429s during prerender.
 */
export async function collectPaginated<T>(
  fetchPage: (cursor: string | undefined) => Promise<NotionPage<T>>,
): Promise<T[]> {
  const items: T[] = [];
  const seenCursors = new Set<string>();
  let cursor: string | undefined;

  for (;;) {
    if (seenCursors.size >= MAX_PAGES) {
      throw new Error(`Notion pagination exceeded ${MAX_PAGES} pages`);
    }

    const page = await fetchPage(cursor);
    items.push(...page.items);

    const next = page.hasMore ? page.nextCursor : null;
    if (!next || seenCursors.has(next)) {
      return items;
    }

    seenCursors.add(next);
    cursor = next;
  }
}
