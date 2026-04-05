import { Client } from "@notionhq/client";
import { NotionAPI } from "notion-client";

import { notionKey } from "@/lib/notion/config";

export const notionPrivateAPI = new NotionAPI();
export const notionAPI = new Client({ auth: notionKey });
