export const rootNotionPageId = "067dd719a912471ea9a3ac10710e7fdf";
export const rootNotionSpaceId = "fde5ac74-eea3-4527-8f00-4482710e1af3";

export const previewImagesEnabled = false;

export const useOfficialNotionAPI =
  false || (process.env.USE_OFFICIAL_NOTION_API === "true" && Boolean(process.env.NOTION_TOKEN));

export const isDev = process.env.NODE_ENV === "development" || !process.env.NODE_ENV;

export const port = process.env.PORT || 3000;
export const rootDomain = isDev ? `localhost:${port}` : null;

export const blogDatabaseId = process.env.NOTION_BLOG_DATABASE_ID;
export const pagesDatabaseId = process.env.NOTION_PAGES_DATABASE_ID;
export const notionKey = process.env.NOTION_TOKEN;
