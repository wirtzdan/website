import { afterEach, expect, test, vi } from "vite-plus/test";

const { getBlogPosts } = vi.hoisted(() => ({ getBlogPosts: vi.fn() }));

vi.mock("@/lib/notion/api", () => ({ getBlogPosts }));

import { GET, revalidate } from "./route";

afterEach(() => {
  vi.restoreAllMocks();
});

test("serves the feed as RSS with the content revalidation window", async () => {
  getBlogPosts.mockResolvedValue({
    results: [
      {
        id: "id-hello",
        title: "Hello",
        slug: "hello",
        description: "First post",
        publishDate: "2024-01-01",
        isFeatured: false,
        isPublished: true,
        coverImage: null,
        coverVideo: null,
        socialImage: null,
        readURL: "/blog/hello",
        coverIcon: null,
      },
    ],
    hasMore: false,
    next_cursor: null,
  });

  const response = await GET();

  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toBe("application/rss+xml; charset=utf-8");
  expect(await response.text()).toContain("<link>https://danielwirtz.com/blog/hello</link>");
  expect(revalidate).toBe(3600);
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
