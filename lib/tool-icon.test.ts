import { expect, test } from "vite-plus/test";

import type { AirtableRecord, ToolFields } from "@/types/content";

import { isToolIconRequest, toolIconProxyPath, toolIconSource, toolIconUrl } from "./tool-icon";

const RECORD = "rec0123456789abcd";
const FILE = "att0123456789abcd";

const icon = (url: string, id = FILE) =>
  [{ id, url: `${url}/original.png`, thumbnails: { large: { url: `${url}/large.png` } } }] as never;

test("uses the large thumbnail and never treats the site root as an image", () => {
  expect(
    toolIconUrl([
      {
        url: "https://dl.airtable.com/original.png",
        thumbnails: { large: { url: "https://dl.airtable.com/large.png" } },
      },
    ] as never),
  ).toBe("https://dl.airtable.com/large.png");

  expect(toolIconUrl(undefined)).toBeUndefined();
  expect(toolIconUrl([{ url: "/" }] as never)).toBeUndefined();
  expect(toolIconUrl([{ url: "/favicon.png" }] as never)).toBeUndefined();
});

test("the page links icons through a stable same-origin path, not the signed URL", () => {
  expect(toolIconProxyPath(RECORD, icon("https://v5.airtableusercontent.com/v3/u/1"))).toBe(
    `/api/tool-icon?record=${RECORD}&file=${FILE}`,
  );
  expect(toolIconProxyPath(RECORD, undefined)).toBeUndefined();
  expect(toolIconProxyPath("not-a-record", icon("https://dl.airtable.com"))).toBeUndefined();
  expect(toolIconProxyPath(RECORD, icon("https://dl.airtable.com", "nope"))).toBeUndefined();
});

test("only well-formed Airtable ids are looked up", () => {
  expect(isToolIconRequest(RECORD, FILE)).toBe(true);
  expect(isToolIconRequest(RECORD, "")).toBe(false);
  expect(isToolIconRequest("rec../../x", FILE)).toBe(false);
});

test("the proxy only fetches the current attachment from Airtable hosts", () => {
  const records = (url: string, id = FILE): AirtableRecord<ToolFields>[] => [
    { id: RECORD, fields: { Name: "Raindrop", Image: icon(url, id) } },
  ];

  expect(toolIconSource(records("https://v5.airtableusercontent.com/v3/u/1"), RECORD, FILE)).toBe(
    "https://v5.airtableusercontent.com/v3/u/1/large.png",
  );
  // A replaced icon has a new attachment id, so the old URL stops resolving.
  expect(
    toolIconSource(records("https://dl.airtable.com", "attzzzzzzzzzzzzzz"), RECORD, FILE),
  ).toBeUndefined();
  expect(toolIconSource(records("https://example.com"), RECORD, FILE)).toBeUndefined();
  expect(
    toolIconSource(records("https://dl.airtable.com"), "recxxxxxxxxxxxxxx", FILE),
  ).toBeUndefined();
});
