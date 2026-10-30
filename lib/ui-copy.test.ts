import { expect, test } from "vite-plus/test";

import { TOOL_PLATFORM_TABS } from "@/lib/tool-platforms";

import { toolEmptyCopy, uiCopy } from "./ui-copy";

test("every tools tab has its own empty-state copy", () => {
  expect(Object.keys(toolEmptyCopy).sort()).toEqual(TOOL_PLATFORM_TABS.map((tab) => tab.id).sort());

  for (const tab of TOOL_PLATFORM_TABS) {
    expect(toolEmptyCopy[tab.id].title.length).toBeGreaterThan(0);
    expect(toolEmptyCopy[tab.id].description.length).toBeGreaterThan(0);
  }
});

test("empty and error strings are written out", () => {
  for (const entry of Object.values(uiCopy)) {
    for (const value of Object.values(entry)) {
      expect(value.trim().length).toBeGreaterThan(0);
    }
  }
});
