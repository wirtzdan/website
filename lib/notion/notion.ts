import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";
import { NotionCompatAPI } from "notion-compat";

import { useOfficialNotionAPI } from "./config";

const notion = useOfficialNotionAPI
  ? new NotionCompatAPI(new Client({ auth: process.env.NOTION_TOKEN }))
  : new NotionAPI();

if (useOfficialNotionAPI) {
  console.warn(
    "Using the official Notion API. Note that many blocks only include partial support for formatting and layout. Use at your own risk."
  );
}

export async function getPage(pageId: string) {
  const recordMap = await notion.getPage(pageId);

  return recordMap;
}

export async function search(params: Record<string, unknown>) {
  return notion.search(params);
}
