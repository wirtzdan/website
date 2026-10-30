import type { BlogPostSummary, GenericPageSummary } from "@/types/content";

import {
  getBooleanProperty,
  getDateProperty,
  getFilesProperty,
  getStringProperty,
  isPublished,
} from "./utils";

export type NotionDatabaseItem = {
  id: string;
  icon?: {
    type?: string;
    emoji?: string;
  };
  properties?: Record<string, any>;
};

/**
 * Same inclusion rules as before: a row needs a slug, a title, and a publish
 * date. Drafts stay in the list. Hiding them is a separate, accepted issue.
 */
export function mapNotionBlogPost(item: NotionDatabaseItem): BlogPostSummary | null {
  if (!item.properties) {
    return null;
  }

  const rawPost = {
    id: item.id,
    title: getStringProperty(item, "Title"),
    slug: getStringProperty(item, "Slug"),
    description: getStringProperty(item, "Description") || null,
    publishDate: getDateProperty(item, "Publish date") || getDateProperty(item, "Created time"),
    modifiedDate: getDateProperty(item, "Last edited time"),
    isFeatured: getBooleanProperty(item, "Featured") ?? false,
    isPublished: isPublished(item),
    coverImage: getFilesProperty(item, "Cover Image"),
    coverVideo: getStringProperty(item, "Cover Video") || null,
    socialImage: getFilesProperty(item, "Social Image"),
  };

  const requiredProperties = ["slug", "title"] as const;
  const isComplete = requiredProperties.every((key) => Boolean(rawPost[key]));
  const coverIcon = item.icon?.type === "emoji" ? (item.icon.emoji ?? null) : null;

  if (isComplete && typeof rawPost.publishDate === "string") {
    return {
      ...rawPost,
      publishDate: rawPost.publishDate,
      modifiedDate: typeof rawPost.modifiedDate === "string" ? rawPost.modifiedDate : undefined,
      readURL: `/blog/${rawPost.slug}`,
      coverIcon,
    };
  }

  return null;
}

/** A page row needs a slug and a title. Published is recorded, not required. */
export function mapNotionGenericPage(item: NotionDatabaseItem): GenericPageSummary | null {
  if (!item.properties) {
    return null;
  }

  const rawPage = {
    id: item.id,
    title: getStringProperty(item, "Name"),
    slug: getStringProperty(item, "Slug"),
    isPublished: getBooleanProperty(item, "Published") ?? false,
    showNavigation: getBooleanProperty(item, "Show navigation") ?? false,
  };

  const requiredProperties = ["slug", "title"] as const;
  const isComplete = requiredProperties.every((key) => Boolean(rawPage[key]));
  if (!isComplete) {
    return null;
  }

  return {
    ...rawPage,
    title: rawPage.title as string,
    slug: rawPage.slug as string,
    readURL: `/${rawPage.slug}`,
  };
}
