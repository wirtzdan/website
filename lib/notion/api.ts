import type {
  BlogPostSummary,
  GenericPageSummary,
  NotionRecordMap,
  PaginatedResults,
} from "@/types/content";

import { blogDatabaseId, pagesDatabaseId } from "@/lib/notion/config";
import { notionAPI, notionPrivateAPI } from "./client";
import { withBudget, withNotionRetry } from "./rate-limited-fetch";

/**
 * Leave headroom under Next's staticPageGenerationTimeout so a stuck Notion
 * fan-out soft-fails the page instead of aborting the whole export worker.
 */
const PAGE_FETCH_BUDGET_MS = Number(process.env.NOTION_PAGE_BUDGET_MS ?? 50_000);
import {
  convertNotionAssetUrl,
  getBooleanProperty,
  getDateProperty,
  getStringProperty,
  isPublished,
} from "./utils";

interface QueryOptions {
  pageSize: number;
  startCursor?: string;
}

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

type NotionDatabaseItem = {
  id: string;
  icon?: {
    type?: string;
    emoji?: string;
  };
  properties?: Record<string, any>;
};

const getFilesProperty = (item: NotionDatabaseItem, propertyName: string) => {
  try {
    const property = item.properties?.[propertyName];
    if (!property || property.type !== "files" || !property.files.length) {
      return null;
    }

    const file = property.files[0];
    let fileUrl: string | null = null;

    if (!file || !file.type) {
      return null;
    }

    switch (file.type) {
      case "external":
        if (file.external?.url) {
          fileUrl = convertNotionAssetUrl(file.external.url, "block", item.id);
        }
        break;
      case "file":
        if (file.file?.url) {
          fileUrl = convertNotionAssetUrl(file.file.url, "block", item.id);
        }
        break;
      default:
        break;
    }

    return fileUrl;
  } catch (error) {
    console.error("Error in getFilesProperty:", error);
    return null;
  }
};

/** Deduplicate identical DB queries within a single Node process (SSG build). */
const blogPostsCache = new Map<string, Promise<PaginatedResults<BlogPostSummary>>>();
const pagesCache = new Map<string, Promise<PaginatedResults<GenericPageSummary>>>();
/** Deduplicate page body fetches (generateMetadata + Page share a slug). */
const pageByIdCache = new Map<string, Promise<NotionRecordMap | null>>();

function cacheKey(pageSize: number, startCursor?: string): string {
  return `${pageSize}:${startCursor ?? ""}`;
}

export const getBlogPosts = async ({
  pageSize,
  startCursor,
}: QueryOptions): Promise<PaginatedResults<BlogPostSummary>> => {
  const key = cacheKey(pageSize, startCursor);
  const cached = blogPostsCache.get(key);
  if (cached) {
    return cached;
  }

  const request = queryBlogPosts({ pageSize, startCursor });
  blogPostsCache.set(key, request);
  try {
    return await request;
  } catch (error) {
    blogPostsCache.delete(key);
    throw error;
  }
};

async function queryBlogPosts({
  pageSize,
  startCursor,
}: QueryOptions): Promise<PaginatedResults<BlogPostSummary>> {
  const query = {
    database_id: blogDatabaseId,
    page_size: pageSize,
    start_cursor: startCursor,
  };
  const collection = await withNotionRetry(() => notionAPI.databases.query(query as any));
  const blogList: BlogPostSummary[] = [];

  collection.results.forEach((item) => {
    if (!("properties" in item)) {
      return;
    }

    const typedItem = item as unknown as NotionDatabaseItem;
    const rawPost = {
      id: typedItem.id,
      title: getStringProperty(typedItem, "Title"),
      slug: getStringProperty(typedItem, "Slug"),
      description: getStringProperty(typedItem, "Description") || null,
      publishDate:
        getDateProperty(typedItem, "Publish date") || getDateProperty(typedItem, "Created time"),
      modifiedDate: getDateProperty(typedItem, "Last edited time"),
      isFeatured: getBooleanProperty(typedItem, "Featured") ?? false,
      isPublished: isPublished(typedItem),
      coverImage: getFilesProperty(typedItem, "Cover Image"),
      coverVideo: getStringProperty(typedItem, "Cover Video") || null,
      socialImage: getFilesProperty(typedItem, "Social Image"),
    };

    const requiredProperties = ["slug", "title"] as const;
    const isComplete = requiredProperties.every((key) => Boolean(rawPost[key]));
    const coverIcon = typedItem.icon?.type === "emoji" ? (typedItem.icon.emoji ?? null) : null;

    if (isComplete && typeof rawPost.publishDate === "string") {
      blogList.push({
        ...rawPost,
        publishDate: rawPost.publishDate,
        modifiedDate: typeof rawPost.modifiedDate === "string" ? rawPost.modifiedDate : undefined,
        readURL: `/blog/${rawPost.slug}`,
        coverIcon,
      });
    }
  });

  return {
    results: blogList,
    hasMore: collection.has_more,
    next_cursor: collection.next_cursor,
  };
}

export const getPageByPageId = async (pageId: string): Promise<NotionRecordMap | null> => {
  const cached = pageByIdCache.get(pageId);
  if (cached) {
    return cached;
  }

  const request = fetchPageByPageId(pageId);
  pageByIdCache.set(pageId, request);
  return request;
};

async function fetchPageByPageId(pageId: string): Promise<NotionRecordMap | null> {
  try {
    const recordMap = (await withBudget(
      () => withNotionRetry(() => notionPrivateAPI.getPage(pageId)),
      PAGE_FETCH_BUDGET_MS,
    )) as NotionRecordMap;
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Notion API error";
    console.error(`Error fetching page with ID ${pageId}:`, message);
    // Soft-fail a single post rather than aborting the whole static export.
    // Cached promise stays as resolved null so generateMetadata + Page share it.
    return null;
  }
}

export const getAllPages = async ({
  pageSize,
  startCursor,
}: QueryOptions): Promise<PaginatedResults<GenericPageSummary>> => {
  const key = cacheKey(pageSize, startCursor);
  const cached = pagesCache.get(key);
  if (cached) {
    return cached;
  }

  const request = queryAllPages({ pageSize, startCursor });
  pagesCache.set(key, request);
  try {
    return await request;
  } catch (error) {
    pagesCache.delete(key);
    throw error;
  }
};

async function queryAllPages({
  pageSize,
  startCursor,
}: QueryOptions): Promise<PaginatedResults<GenericPageSummary>> {
  const query = {
    database_id: pagesDatabaseId,
    page_size: pageSize,
    start_cursor: startCursor,
  };
  const collection = await withNotionRetry(() => notionAPI.databases.query(query as any));
  const pageList: GenericPageSummary[] = [];

  collection.results.forEach((item) => {
    if (!("properties" in item)) {
      return;
    }

    const typedItem = item as unknown as NotionDatabaseItem;
    const rawPage = {
      id: typedItem.id,
      title: getStringProperty(typedItem, "Name"),
      slug: getStringProperty(typedItem, "Slug"),
      isPublished: getBooleanProperty(typedItem, "Published") ?? false,
      showNavigation: getBooleanProperty(typedItem, "Show navigation") ?? false,
    };

    const requiredProperties = ["slug", "title"] as const;
    const isComplete = requiredProperties.every((key) => Boolean(rawPage[key]));

    if (isComplete) {
      pageList.push({
        ...rawPage,
        title: rawPage.title as string,
        slug: rawPage.slug as string,
        readURL: `/${rawPage.slug}`,
      });
    }
  });

  return {
    results: pageList,
    hasMore: collection.has_more,
    next_cursor: collection.next_cursor,
  };
}
