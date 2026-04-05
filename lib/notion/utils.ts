import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

type NotionPropertyValue = {
  type: string;
  [key: string]: any;
};

type NotionDatabaseEntry = {
  properties?: Record<string, NotionPropertyValue>;
};

export const getStringProperty = (
  databaseEntry: NotionDatabaseEntry | null | undefined,
  key: string,
) => {
  if (!databaseEntry?.properties || !key) {
    return null;
  }

  const value = databaseEntry.properties[key];
  if (!value) {
    return null;
  }

  switch (value.type) {
    case "number":
      return value.number?.toString() || null;
    case "url":
      return value.url || null;
    case "select":
      return value.select?.name || null;
    case "multi_select":
      return value.multi_select?.map((option: { name: string }) => option.name).join(", ") || null;
    case "date":
      return value.date?.start || null;
    case "title":
      return value.title?.[0]?.plain_text || null;
    case "rich_text":
      return value.rich_text?.[0]?.plain_text || null;
    default:
      return null;
  }
};

const NOTION_ASSETS_ADDRESSES = ["secure.notion-static.com", "prod-files-secure"];

const SELF_HOSTED_ASSETS_ADDRESSES = ["royli-blog-assets.oss-us-west-1.aliyuncs.com"];

export const getDateProperty = (databaseEntry: NotionDatabaseEntry, key: string) => {
  if (!databaseEntry?.properties) {
    return undefined;
  }

  const value = databaseEntry.properties[key];
  if (!value) {
    return undefined;
  }

  switch (value.type) {
    case "date":
      if (!value.date) return undefined;
      if (!value.date.end) {
        return dayjs.tz(value.date.start, value.date.time_zone || "UTC").toString();
      }

      return [
        dayjs.tz(value.date.start, value.date.time_zone || "UTC").toString(),
        dayjs.tz(value.date.end, value.date.time_zone || "UTC").toString(),
      ];
    case "last_edited_time":
      return dayjs.tz(value.last_edited_time, "UTC").toString();
    case "created_time":
      return dayjs.tz(value.created_time, "UTC").toString();
    default:
      console.warn('key %s is of type "%s" instead of "date"', key, value.type);
      return undefined;
  }
};

export const getBooleanProperty = (databaseEntry: NotionDatabaseEntry, key: string) => {
  if (!databaseEntry?.properties) {
    return undefined;
  }

  const value = databaseEntry.properties[key];
  if (!value) {
    return undefined;
  }

  switch (value.type) {
    case "checkbox":
      return value.checkbox;
    default:
      console.warn('key "%s" is of type "%s" instead of "boolean"', key, value.type);
      return undefined;
  }
};

export const isNotionAsset = (url: string) => {
  return NOTION_ASSETS_ADDRESSES.some((address) => url.includes(address));
};

export const isNotionImageUrl = (url: string) => {
  return url.includes("notion.so/image/");
};

export const isSelfHostedAsset = (url: string) => {
  return SELF_HOSTED_ASSETS_ADDRESSES.some((address) => url.includes(address));
};

export const convertNotionAssetUrl = (url: string, parentTableType: string, blockId: string) => {
  if (!isNotionAsset(url)) {
    return url;
  }

  const urlObject = new URL(url);

  if (
    (urlObject.pathname.startsWith("/secure.notion-static.com") &&
      urlObject.hostname.endsWith(".amazonaws.com")) ||
    (urlObject.hostname.startsWith("prod-files-secure") &&
      urlObject.hostname.endsWith(".amazonaws.com"))
  ) {
    const keys = Array.from(urlObject.searchParams.keys());

    for (const key of keys) {
      if (key.toLowerCase().startsWith("x-")) {
        urlObject.searchParams.delete(key);
      }
    }

    url = urlObject.toString();
  }

  if (url.startsWith("/images")) {
    url = `https://www.notion.so${url}`;
  }

  url = `https://www.notion.so${
    url.startsWith("/image") ? url : `/image/${encodeURIComponent(url)}`
  }`;

  const notionImageUrlV2 = new URL(url);
  let table = parentTableType === "space" ? "block" : parentTableType;

  if (table === "collection" || table === "team") {
    table = "block";
  }

  notionImageUrlV2.searchParams.set("table", table);
  notionImageUrlV2.searchParams.set("id", blockId);
  notionImageUrlV2.searchParams.set("cache", "v2");

  return notionImageUrlV2.toString();
};

export const isPublished = (databaseEntry: NotionDatabaseEntry) => {
  if (!databaseEntry?.properties) {
    return false;
  }

  const status = databaseEntry.properties.Status;
  if (!status || status.type !== "status") {
    return false;
  }

  return status.status?.name === "Published";
};
