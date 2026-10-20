import { expect, test } from "vite-plus/test";

import { toolsForPlatformTab } from "./tool-platforms";

const tools = [
  { fields: { Platform: "Mac", Name: "Raycast" } },
  { fields: { Platform: "Android", Name: "TickTick" } },
  { fields: { Platform: "iOS", Name: "Future iOS row" } },
  { fields: { Platform: "Chrome", Name: "Noir" } },
  { fields: { Platform: "Safari", Name: "Future Safari row" } },
  { fields: { Platform: "Web", Name: "Notion" } },
];

test("iOS tab includes the Airtable Android rows", () => {
  expect(toolsForPlatformTab(tools, "iOS").map((tool) => tool.fields.Name)).toEqual([
    "TickTick",
    "Future iOS row",
  ]);
});

test("Safari tab includes the Airtable Chrome rows", () => {
  expect(toolsForPlatformTab(tools, "Safari").map((tool) => tool.fields.Name)).toEqual([
    "Noir",
    "Future Safari row",
  ]);
});

test("Mac and Web tabs stay on their own platform values", () => {
  expect(toolsForPlatformTab(tools, "Mac").map((tool) => tool.fields.Name)).toEqual(["Raycast"]);
  expect(toolsForPlatformTab(tools, "Web").map((tool) => tool.fields.Name)).toEqual(["Notion"]);
});
