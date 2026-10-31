import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

import { trimDescription } from "@/lib/blog-metadata";
import type { BlogPostSummary } from "@/types/content";

const { getBlogPosts, getPageByPageId } = vi.hoisted(() => ({
  getBlogPosts: vi.fn(),
  getPageByPageId: vi.fn(),
}));

vi.mock("@/lib/notion/api", () => ({ getBlogPosts, getPageByPageId }));

import { GET, revalidate } from "./route";

function post(slug: string, overrides: Partial<BlogPostSummary> = {}): BlogPostSummary {
  return {
    id: `id-${slug}`,
    title: slug,
    slug,
    description: null,
    publishDate: "2024-01-01",
    isFeatured: false,
    isPublished: true,
    coverImage: null,
    coverVideo: null,
    socialImage: null,
    readURL: `/blog/${slug}`,
    coverIcon: null,
    ...overrides,
  };
}

function recordMap(text: string) {
  return {
    block: {
      heading: { value: { type: "header", properties: { title: [["Heading"]] } } },
      first: {
        value: { type: "text", properties: { title: [[text.slice(0, 5)], [text.slice(5)]] } },
      },
    },
  };
}

function servePosts(...posts: BlogPostSummary[]) {
  getBlogPosts.mockResolvedValue({ results: posts, hasMore: false, next_cursor: null });
}

function itemFor(xml: string, slug: string): string {
  const item = xml
    .split("<item>")
    .find((chunk) => chunk.includes(`<link>https://danielwirtz.com/blog/${slug}</link>`));
  if (!item) throw new Error(`No item for ${slug}`);
  return item;
}

beforeEach(() => {
  getPageByPageId.mockResolvedValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

test("serves the feed as RSS with the content revalidation window", async () => {
  servePosts(post("hello", { description: "First post" }));

  const response = await GET();

  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toBe("application/rss+xml; charset=utf-8");
  expect(await response.text()).toContain("<link>https://danielwirtz.com/blog/hello</link>");
  expect(revalidate).toBe(3600);
});

test("uses the Notion description, else the first paragraph like the meta description", async () => {
  servePosts(post("described", { description: "From Notion & co" }), post("derived"), post("long"));
  const longText = "A long opening paragraph that keeps going ".repeat(6);
  getPageByPageId.mockImplementation(async (id: string) =>
    id === "id-long" ? recordMap(longText) : recordMap("Opening <paragraph>"),
  );

  const xml = await (await GET()).text();

  expect(itemFor(xml, "described")).toContain("<description>From Notion &amp; co</description>");
  expect(itemFor(xml, "derived")).toContain("<description>Opening &lt;paragraph&gt;</description>");
  const trimmed = trimDescription(longText);
  expect(trimmed.length).toBeLessThanOrEqual(160);
  expect(itemFor(xml, "long")).toContain(`<description>${trimmed}</description>`);
  expect(getPageByPageId).not.toHaveBeenCalledWith("id-described");
});

test("only fetches bodies for published posts", async () => {
  servePosts(post("live"), post("draft", { isPublished: false }));

  await GET();

  expect(getPageByPageId).toHaveBeenCalledTimes(1);
  expect(getPageByPageId).toHaveBeenCalledWith("id-live");
});

test("a post whose body fails keeps its item without a description", async () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  servePosts(post("broken"), post("missing"), post("fine"));
  getPageByPageId.mockImplementation(async (id: string) => {
    if (id === "id-broken") throw new Error("Notion timeout");
    return id === "id-fine" ? recordMap("All good here") : null;
  });

  const response = await GET();
  const xml = await response.text();

  expect(response.status).toBe(200);
  expect(itemFor(xml, "broken")).not.toContain("<description>");
  expect(itemFor(xml, "missing")).not.toContain("<description>");
  expect(itemFor(xml, "fine")).toContain("<description>All good here</description>");
  expect(error).toHaveBeenCalledWith(
    "RSS: could not load the description for broken:",
    "Notion timeout",
  );
});

test("answers 503 with Retry-After when Notion fails, and logs it", async () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  getBlogPosts.mockRejectedValue(new Error("Notion is down"));

  const response = await GET();

  expect(response.status).toBe(503);
  expect(response.headers.get("retry-after")).toBe("300");
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(error).toHaveBeenCalledWith("RSS: could not load blog posts:", "Notion is down");
});
