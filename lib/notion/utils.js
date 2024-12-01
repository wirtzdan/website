import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getStringProperty = (databaseEntry, key) => {
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
      return value.multi_select?.map((opt) => opt.name).join(", ") || null;
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

const NOTION_ASSETS_ADDRESSES = [
  "secure.notion-static.com",
  "prod-files-secure",
];

const SELF_HOSTED_ASSETS_ADDRESSES = [
  "royli-blog-assets.oss-us-west-1.aliyuncs.com",
];

export const getDateProperty = (databaseEntry, key) => {
  if (!("properties" in databaseEntry)) {
    return undefined;
  }

  const value = databaseEntry.properties[key];

  switch (value.type) {
    case "date":
      if (!value.date) return undefined;
      if (!value.date.end)
        return dayjs
          .tz(value.date.start, value.date.time_zone || "UTC")
          .toString();
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
  }
};

export const getBooleanProperty = (databaseEntry, key) => {
  if (!("properties" in databaseEntry)) {
    return undefined;
  }

  const value = databaseEntry.properties[key];

  switch (value.type) {
    case "checkbox":
      return value.checkbox;
    default:
      console.warn(
        'key "%s" is of type "%s" instead of "boolean"',
        key,
        value.type
      );
  }
};

export const isNotionAsset = (url) => {
  return NOTION_ASSETS_ADDRESSES.some((address) => url.includes(address));
};

export const isNotionImageUrl = (url) => {
  return url.includes("notion.so/image/");
};

export const isSelfHostedAsset = (url) => {
  return SELF_HOSTED_ASSETS_ADDRESSES.some((address) => url.includes(address));
};

export const convertNotionAssetUrl = (url, parentTableType, blockId) => {
  if (!isNotionAsset(url)) {
    return url;
  }

  const u = new URL(url);

  if (
    (u.pathname.startsWith("/secure.notion-static.com") &&
      u.hostname.endsWith(".amazonaws.com")) ||
    (u.hostname.startsWith("prod-files-secure") &&
      u.hostname.endsWith(".amazonaws.com"))
  ) {
    const keys = Array.from(u.searchParams.keys());

    for (const key of keys) {
      if (key.toLowerCase().startsWith("x-")) {
        u.searchParams.delete(key);
      }
    }

    url = u.toString();
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

  url = notionImageUrlV2.toString();

  return url;
};

export const isPublished = (databaseEntry) => {
  if (!("properties" in databaseEntry)) {
    return false;
  }

  const status = databaseEntry.properties["Status"];
  if (!status || status.type !== "status") {
    return false;
  }

  return status.status?.name === "Published";
};
