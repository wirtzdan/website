import { cache } from "react";

import type {
  BlogPostSummary,
  BookSummary,
  GenericPageSummary,
  NotionRecordMap,
  PaginatedResults,
} from "@/types/content";

import { CONTENT_CACHE_TAGS, CONTENT_REVALIDATE_SECONDS, singleflight } from "@/lib/content-cache";
import { persist } from "@/lib/persist-cache";
import {
  blogDatabaseId,
  booksDatabaseId,
  pagesDatabaseId,
  photosDatabaseId,
} from "@/lib/notion/config";
import { mapNotionBook } from "./books";
import { notionAPI, notionPrivateAPI } from "./client";
import { NOTION_DATABASE_PAGE_SIZE, collectPaginated } from "./paginate";
import { mapNotionPhoto, type Photo } from "./photos";
import { withNotionRetry } from "./rate-limited-fetch";
import { mapNotionBlogPost, mapNotionGenericPage, type NotionDatabaseItem } from "./summaries";

type WrappedNotionBlock = {
  role?: string;
  value?: unknown;
};

type NestedWrappedBlockValue = {
  role?: string;
  value: Record<string, unknown>;
};

function hasNestedWrappedBlockValue(value: unknown): value is NestedWrappedBlockValue {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybeWrapped = value as { value?: unknown };
  return Boolean(maybeWrapped.value && typeof maybeWrapped.value === "object");
}

const cacheOptions = (tags: string[]) => ({
  revalidate: CONTENT_REVALIDATE_SECONDS,
  tags,
});

function mapQueryResults<T>(
  results: readonly unknown[],
  mapItem: (item: NotionDatabaseItem) => T | null,
): T[] {
  const mapped: T[] = [];
  for (const item of results) {
    if (!item || typeof item !== "object" || !("properties" in item)) {
      continue;
    }
    const value = mapItem(item as NotionDatabaseItem);
    if (value) {
      mapped.push(value);
    }
  }
  return mapped;
}

async function queryDatabase<T>(
  databaseId: string | undefined,
  missingMessage: string,
  mapItem: (item: NotionDatabaseItem) => T | null,
): Promise<T[]> {
  if (!databaseId) {
    throw new Error(missingMessage);
  }

  return collectPaginated(async (startCursor) => {
    const collection = await withNotionRetry(() =>
      notionAPI.databases.query({
        database_id: databaseId,
        page_size: NOTION_DATABASE_PAGE_SIZE,
        start_cursor: startCursor,
      }),
    );

    return {
      items: mapQueryResults(collection.results, mapItem),
      hasMore: collection.has_more,
      nextCursor: collection.next_cursor,
    };
  });
}

async function loadBlogPosts(): Promise<BlogPostSummary[]> {
  return queryDatabase(blogDatabaseId, "NOTION_BLOG_DATABASE_ID is required", mapNotionBlogPost);
}

const readBlogPosts = persist(loadBlogPosts, ["notion-blog-posts-v1"], {
  ...cacheOptions([CONTENT_CACHE_TAGS.blog, CONTENT_CACHE_TAGS.all]),
});

export const getBlogPosts = cache(async (): Promise<PaginatedResults<BlogPostSummary>> => {
  const results = await singleflight("notion-blog-posts-v1", readBlogPosts);
  return { results, hasMore: false, next_cursor: null };
});

function normalizeRecordMap(recordMap: NotionRecordMap): NotionRecordMap {
  const normalizedBlock = Object.fromEntries(
    Object.entries(recordMap?.block ?? {}).map(([blockId, block]) => {
      const typedBlock = block as WrappedNotionBlock | undefined;

      if (hasNestedWrappedBlockValue(typedBlock?.value)) {
        return [
          blockId,
          {
            ...typedBlock,
            role: typedBlock.role ?? typedBlock.value.role,
            value: typedBlock.value.value,
          },
        ];
      }

      return [blockId, block];
    }),
  );

  return {
    ...recordMap,
    block: normalizedBlock,
  } as NotionRecordMap;
}

async function loadPageByPageId(pageId: string): Promise<NotionRecordMap> {
  const recordMap = (await withNotionRetry(() =>
    notionPrivateAPI.getPage(pageId),
  )) as NotionRecordMap;
  if (!recordMap) {
    throw new Error(`Notion page ${pageId} returned no record map`);
  }
  return normalizeRecordMap(recordMap);
}

const readPageByPageId = persist(loadPageByPageId, ["notion-page-record-map-v1"], {
  ...cacheOptions([CONTENT_CACHE_TAGS.pages, CONTENT_CACHE_TAGS.all]),
});

/**
 * Per-request dedupe for generateMetadata and the page. A thrown Notion error
 * is not stored in the data cache. The null returned here lives only for this
 * request, so the next render tries the page again instead of 404ing until
 * the lambda goes cold.
 */
export const getPageByPageId = cache(async (pageId: string): Promise<NotionRecordMap | null> => {
  try {
    return await singleflight(`notion-page:${pageId}`, () => readPageByPageId(pageId));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Notion API error";
    console.error(`Error fetching page with ID ${pageId}:`, message);
    return null;
  }
});

async function loadAllPages(): Promise<GenericPageSummary[]> {
  return queryDatabase(
    pagesDatabaseId,
    "NOTION_PAGES_DATABASE_ID is required",
    mapNotionGenericPage,
  );
}

const readAllPages = persist(loadAllPages, ["notion-pages-v1"], {
  ...cacheOptions([CONTENT_CACHE_TAGS.pages, CONTENT_CACHE_TAGS.all]),
});

export const getAllPages = cache(async (): Promise<PaginatedResults<GenericPageSummary>> => {
  const results = await singleflight("notion-pages-v1", readAllPages);
  return { results, hasMore: false, next_cursor: null };
});

async function loadBooks(): Promise<BookSummary[]> {
  return queryDatabase(booksDatabaseId, "NOTION_BOOKS_DATABASE_ID is required", mapNotionBook);
}

const readBooks = persist(loadBooks, ["notion-books-v1"], {
  ...cacheOptions([CONTENT_CACHE_TAGS.books, CONTENT_CACHE_TAGS.all]),
});

export const getBooks = cache(() => singleflight("notion-books-v1", readBooks));

async function loadPhotos(): Promise<Photo[]> {
  return queryDatabase(photosDatabaseId, "NOTION_PHOTOS_DATABASE_ID is required", mapNotionPhoto);
}

const readPhotos = persist(loadPhotos, ["notion-photos-v1"], {
  ...cacheOptions([CONTENT_CACHE_TAGS.photos, CONTENT_CACHE_TAGS.all]),
});

export const getPhotos = cache(() => singleflight("notion-photos-v1", readPhotos));
