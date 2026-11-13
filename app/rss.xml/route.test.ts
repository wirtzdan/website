import { afterEach, expect, test, vi } from "vite-plus/test";

import { CONTENT_INDEX_PATHS, defaultRevalidatePlan } from "@/lib/content-cache";
import type { BlogPostSummary } from "@/types/content";

import * as route from "./route";

const notion = vi.hoisted(() => ({
  loadBlogPosts: vi.fn(),
  getBlogPosts: vi.fn(),
  getPageByPageId: vi.fn(),
}));

vi.mock("@/lib/notion/api", () => notion);

afterEach(() => {
  vi.clearAllMocks();
});

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

test("is prerendered at build time with no time-based revalidate", () => {
  expect(route.dynamic).toBe("force-static");
  expect(route.revalidate).toBe(false);
});

test("POST /api/revalidate refreshes the feed on every call", () => {
  expect(CONTENT_INDEX_PATHS).toContain("/rss.xml");
  expect(defaultRevalidatePlan().paths).toContain("/rss.xml");
});

test("serves published posts newest first with the existing content type", async () => {
  notion.loadBlogPosts.mockResolvedValue([
    post("older", { publishDate: "2023-05-01", description: "Old & gold" }),
    post("secret-draft", { publishDate: "2026-01-01", isPublished: false }),
    post("newer", { publishDate: "2025-02-01" }),
  ]);

  const response = await route.GET();
  const xml = await response.text();

  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toBe("application/xml");
  expect(xml).toContain("<description>Old &amp; gold</description>");
  expect(xml).not.toContain("secret-draft");
  expect(xml.indexOf("/blog/newer")).toBeLessThan(xml.indexOf("/blog/older"));
});

test("makes one Notion query and fetches no post bodies", async () => {
  notion.loadBlogPosts.mockResolvedValue([post("a"), post("b"), post("c")]);

  await route.GET();

  expect(notion.loadBlogPosts).toHaveBeenCalledTimes(1);
  // getBlogPosts's data cache would copy its 3600s revalidate onto this route.
  expect(notion.getBlogPosts).not.toHaveBeenCalled();
  expect(notion.getPageByPageId).not.toHaveBeenCalled();
});

test("a Notion failure throws instead of returning a response that would be cached", async () => {
  notion.loadBlogPosts.mockRejectedValue(new Error("Notion is down"));
  await expect(route.GET()).rejects.toThrow("Notion is down");
});
