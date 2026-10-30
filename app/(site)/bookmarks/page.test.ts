import { afterEach, expect, test, vi } from "vite-plus/test";

import type { BookmarkItem } from "@/types/content";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function bookmark(created: string, title: string): BookmarkItem {
  return { title, cover: "", created, type: "link", link: "https://example.com" };
}

async function renderBookmarks() {
  const { default: Page } = await import("./page");
  const element = await Page();
  return element.props.bookmarks.items as BookmarkItem[];
}

test("a failed Raindrop response throws instead of rendering", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("nope", { status: 401 })),
  );

  const { default: Page } = await import("./page");

  await expect(Page()).rejects.toThrow("Raindrop responded with 401");
});

test("a successful response with no items renders an empty list", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => jsonResponse({ result: true })),
  );

  await expect(renderBookmarks()).resolves.toEqual([]);
});

test("bookmark items are sorted newest first", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      jsonResponse({
        items: [bookmark("2020-01-01", "Older"), bookmark("2024-05-01", "Newer")],
      }),
    ),
  );

  const items = await renderBookmarks();

  expect(items.map((item) => item.title)).toEqual(["Newer", "Older"]);
});
