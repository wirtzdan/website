import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

import type { BlogPostSummary, GenericPageSummary } from "@/types/content";

const { getBlogPosts, getAllPages } = vi.hoisted(() => ({
  getBlogPosts: vi.fn(),
  getAllPages: vi.fn(),
}));

vi.mock("@/lib/notion/api", () => ({ getBlogPosts, getAllPages }));

import sitemap from "./sitemap";

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

function page(slug: string, isPublished: boolean): GenericPageSummary {
  return {
    id: `id-${slug}`,
    title: slug,
    slug,
    isPublished,
    showNavigation: false,
    readURL: `/${slug}`,
  };
}

function results<T>(items: T[]) {
  return { results: items, hasMore: false, next_cursor: null };
}

beforeEach(() => {
  getBlogPosts.mockResolvedValue(results([]));
  getAllPages.mockResolvedValue(results([]));
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("lists the static routes as absolute URLs without a trailing slash", async () => {
  const urls = (await sitemap()).map((entry) => entry.url);

  expect(urls).toContain("https://danielwirtz.com");
  for (const path of [
    "/blog",
    "/about",
    "/pizza",
    "/bread",
    "/fuse-box",
    "/photos",
    "/newsletter",
  ]) {
    expect(urls).toContain(`https://danielwirtz.com${path}`);
  }
  for (const url of urls) {
    expect(url).toMatch(/^https:\/\/danielwirtz\.com(\/[^/]+)*$/);
  }
  expect(urls.some((url) => url.includes("/api/"))).toBe(false);
});

test("includes published posts and pages only", async () => {
  getBlogPosts.mockResolvedValue(
    results([
      post("live", { modifiedDate: "2024-03-02T10:00:00.000Z" }),
      post("no-edit-date", { publishDate: "2023-05-06" }),
      post("draft", { isPublished: false }),
    ]),
  );
  getAllPages.mockResolvedValue(
    results([page("now", true), page("hidden", false), page("about", true)]),
  );

  const entries = await sitemap();
  const urls = entries.map((entry) => entry.url);

  expect(entries).toContainEqual({
    url: "https://danielwirtz.com/blog/live",
    lastModified: "2024-03-02T10:00:00.000Z",
  });
  expect(entries).toContainEqual({
    url: "https://danielwirtz.com/blog/no-edit-date",
    lastModified: "2023-05-06",
  });
  expect(urls).toContain("https://danielwirtz.com/now");
  expect(urls).not.toContain("https://danielwirtz.com/blog/draft");
  expect(urls).not.toContain("https://danielwirtz.com/hidden");
  expect(urls.filter((url) => url === "https://danielwirtz.com/about")).toHaveLength(1);
});

test("still returns the static routes when Notion fails", async () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  getBlogPosts.mockRejectedValue(new Error("Notion is down"));
  getAllPages.mockResolvedValue(results([page("now", true)]));

  const urls = (await sitemap()).map((entry) => entry.url);

  expect(urls).toContain("https://danielwirtz.com");
  expect(urls).toContain("https://danielwirtz.com/blog");
  expect(urls).toContain("https://danielwirtz.com/now");
  expect(urls.some((url) => url.includes("/blog/"))).toBe(false);
  expect(error).toHaveBeenCalledWith("Sitemap: could not load blog posts:", "Notion is down");
});
