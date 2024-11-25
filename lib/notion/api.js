import { blogDatabaseId, pagesDatabaseId } from "@/lib/notion/config";
import { notionAPI, notionPrivateAPI } from "./client";
import {
  getBooleanProperty,
  getDateProperty,
  getPostCoverImage,
  getStringProperty,
} from "./utils";

export const getBlogPosts = async ({ pageSize, startCursor }) => {
  const query = {
    database_id: blogDatabaseId,
    page_size: pageSize,
    start_cursor: startCursor,
  };
  const collection = await notionAPI.databases.query(query);
  const blogList = [];

  collection.results.forEach((item) => {
    if (!("properties" in item)) {
      return;
    }

    const rawPost = {
      id: item.id,
      title: getStringProperty(item, "Name"),
      slug: getStringProperty(item, "Slug"),
      excerpt: getStringProperty(item, "Excerpt") || null,
      publishDate:
        getDateProperty(item, "Publish date") ||
        getDateProperty(item, "Created time"),
      lastEditDate: getDateProperty(item, "Last edited time"),
      isFeatured: getBooleanProperty(item, "Featured") ?? false,
      isPublished: getBooleanProperty(item, "Published") ?? false,
      showBanner: getBooleanProperty(item, "Show banner") ?? false,
      videoLink: getStringProperty(item, "Video link") || null,
    };
    const requiredProperties = ["slug", "title"];
    const isComplete = requiredProperties.every((key) => Boolean(rawPost[key]));
    const coverImage = getPostCoverImage(item);
    const coverIcon = item.icon?.type === "emoji" ? item.icon.emoji : null;

    if (isComplete) {
      blogList.push({
        ...rawPost,
        title: rawPost.title,
        slug: rawPost.slug,
        publishDate: rawPost.publishDate,
        lastEditDate: rawPost.lastEditDate,
        readURL: `/blog/${rawPost.slug}`,
        coverImage,
        coverIcon,
      });
    }
  });

  return {
    results: blogList,
    hasMore: collection.has_more,
    next_cursor: collection.next_cursor,
  };
};

export const getPageByPageId = async (pageId) => {
  console.log("pageId → ", pageId);
  try {
    return await notionPrivateAPI.getPage(pageId, {});
  } catch (error) {
    console.error(`Error fetching page with ID ${pageId}:`, error.message);
    return null; // Return null if the page is not found
  }
};

export const getAllPages = async ({ pageSize, startCursor }) => {
  const query = {
    database_id: pagesDatabaseId,
    page_size: pageSize,
    start_cursor: startCursor,
  };
  const collection = await notionAPI.databases.query(query);
  const pageList = [];

  console.log("collection → ", collection);

  collection.results.forEach((item) => {
    if (!("properties" in item)) {
      return;
    }

    const rawPage = {
      id: item.id,
      title: getStringProperty(item, "Name"),
      slug: getStringProperty(item, "Slug"),
      isPublished: getBooleanProperty(item, "Published") ?? false,
      showNavigation: getBooleanProperty(item, "Show navigation") ?? false,
    };

    const requiredProperties = ["slug", "title"];
    const isComplete = requiredProperties.every((key) => Boolean(rawPage[key]));

    if (isComplete) {
      pageList.push({
        ...rawPage,
        readURL: `/${rawPage.slug}`,
      });
    }
  });

  return {
    results: pageList,
    hasMore: collection.has_more,
    next_cursor: collection.next_cursor,
  };
};
