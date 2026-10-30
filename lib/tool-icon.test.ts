import { expect, test } from "vite-plus/test";

import { toolIconUrl } from "./tool-icon";

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
