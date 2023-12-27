import { NotionAPI } from "notion-client";
import { Client } from "@notionhq/client";

import { notionKey } from "@/lib/notion/config";

// Rename to Notion Unnofical API
export const notionPrivateAPI = new NotionAPI();

// Rename to Notion Official API
export const notionAPI = new Client({ auth: notionKey });
