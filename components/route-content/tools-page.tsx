import type { AirtableRecord, ToolFields } from "@/lib/airtable";
import { toolIconTints } from "@/lib/tool-tint";

import ToolsBrowser from "./tools-browser";

type ToolsPageProps = {
  tools: AirtableRecord<ToolFields>[];
};

export default async function ToolsPage({ tools }: ToolsPageProps) {
  const tints = await toolIconTints(tools.map((tool) => tool.fields.Image));
  return <ToolsBrowser tools={tools} tints={tints} />;
}
