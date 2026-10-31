import { expect, test, vi } from "vite-plus/test";

import type { Metadata } from "next";

import { buildBlogPostMetadata } from "@/lib/blog-metadata";
import * as pageMetadata from "@/lib/page-metadata";
import { siteMetadata } from "@/lib/site-metadata";
import { SITE_URL, absoluteUrl } from "@/lib/site-url";

import { generateMetadata as genericPageMetadata } from "../app/(site)/[slug]/page";
import { generateMetadata as blogPostMetadata } from "../app/(site)/blog/[slug]/page";

vi.mock("@/lib/notion/api", () => ({
  getAllPages: async () => ({
    results: [{ id: "p1", title: "Now", slug: "now", isPublished: true }],
  }),
  getBlogPosts: async () => ({
    results: [
      {
        id: "b1",
        title: "Spot the difference",
        slug: "spot-the-difference-superpower",
        description: "A superpower.",
        publishDate: "2025-01-01",
        socialImage: null,
      },
    ],
  }),
  getPageByPageId: async () => null,
}));
vi.mock("@/components/notion-page", () => ({ default: () => null }));
vi.mock("@/components/blog-article-json-ld", () => ({ default: () => null }));
vi.mock("@/layouts/page", () => ({ default: () => null }));
vi.mock("@/layouts/blog", () => ({ default: () => null }));

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

function expectUrls(metadata: Metadata, expected: string) {
  const ogUrl = (metadata.openGraph as { url?: string } | undefined)?.url;
  expect(metadata.alternates?.canonical).toBe(expected);
  expect(ogUrl).toBe(expected);
  expect(new URL(expected).origin).toBe("https://danielwirtz.com");
}

test("absoluteUrl joins paths onto the danielwirtz.com origin", () => {
  expect(SITE_URL).toBe("https://danielwirtz.com");
  expect(absoluteUrl()).toBe("https://danielwirtz.com");
  expect(absoluteUrl("/")).toBe("https://danielwirtz.com");
  expect(absoluteUrl("/blog/a")).toBe("https://danielwirtz.com/blog/a");
  expect(absoluteUrl("blog/a")).toBe("https://danielwirtz.com/blog/a");
  expect(absoluteUrl("//evil.example/x")).toBe("https://danielwirtz.com/evil.example/x");
});

test("metadataBase and site og:url use the same origin", () => {
  expect(siteMetadata.metadataBase).toEqual(new URL("https://danielwirtz.com"));
  expect((siteMetadata.openGraph as { url?: string }).url).toBe("https://danielwirtz.com");
});

test("static pages set canonical and og:url to their own path", () => {
  expectUrls(pageMetadata.homeMetadata, "https://danielwirtz.com");
  expectUrls(pageMetadata.aboutMetadata, "https://danielwirtz.com/about");
  expectUrls(pageMetadata.blogIndexMetadata, "https://danielwirtz.com/blog");
  expectUrls(pageMetadata.fuseBoxMetadata, "https://danielwirtz.com/fuse-box");
});

test("static pages keep the site's Open Graph image and type", () => {
  const og = pageMetadata.aboutMetadata.openGraph as { images?: unknown; type?: string };
  expect(og.type).toBe("website");
  expect(og.images).toEqual(siteMetadata.openGraph?.images);
});

test("blog posts use the post URL for canonical and og:url", async () => {
  expectUrls(
    buildBlogPostMetadata({ title: "T", publishDate: "2025-01-01", slug: "s" }),
    "https://danielwirtz.com/blog/s",
  );
  expectUrls(
    await blogPostMetadata(params("spot-the-difference-superpower")),
    "https://danielwirtz.com/blog/spot-the-difference-superpower",
  );
});

test("Notion pages under /[slug] use their own URL", async () => {
  expectUrls(await genericPageMetadata(params("now")), "https://danielwirtz.com/now");
});
