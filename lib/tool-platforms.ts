/**
 * The iOS and Safari tabs have always been labeled that way. Airtable still
 * stores those rows as "Android" and "Chrome" — phone apps and browser
 * extensions. Filtering on the visible label drops every one of those links.
 */
export const TOOL_PLATFORM_TABS = [
  { id: "Mac", label: "Mac", airtableValues: ["Mac"] },
  { id: "iOS", label: "iOS", airtableValues: ["iOS", "Android"] },
  { id: "Safari", label: "Safari", airtableValues: ["Safari", "Chrome"] },
  { id: "Web", label: "Web", airtableValues: ["Web"] },
] as const;

export type ToolPlatformTabId = (typeof TOOL_PLATFORM_TABS)[number]["id"];

export function toolsForPlatformTab<T extends { fields: { Platform?: string } }>(
  tools: T[],
  tabId: string,
): T[] {
  const tab = TOOL_PLATFORM_TABS.find((item) => item.id === tabId);
  if (!tab) {
    return [];
  }

  const allowed = new Set<string>(tab.airtableValues);
  return tools.filter((tool) => {
    const platform = tool.fields.Platform;
    return typeof platform === "string" && allowed.has(platform);
  });
}
