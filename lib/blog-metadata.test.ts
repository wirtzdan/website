import { expect, test } from "vite-plus/test";

import {
  buildBlogPostMetadata,
  getDescriptionFromRecordMap,
  trimDescription,
} from "@/lib/blog-metadata";
import type { NotionRecordMapWithBlocks } from "@/types/content";

type Og = { images?: { url: string; width?: number; height?: number; alt?: string }[] } & Record<
  string,
  unknown
>;

test("trimDescription leaves short text alone and collapses whitespace", () => {
  expect(trimDescription("  Short   and sweet. ")).toBe("Short and sweet.");
});

test("trimDescription cuts at a word boundary with an ellipsis", () => {
  const text = `${"word ".repeat(40)}end`;
  const trimmed = trimDescription(text);
  expect(trimmed.length).toBeLessThanOrEqual(160);
  expect(trimmed.endsWith("word…")).toBe(true);
});

test("trimDescription never ends mid-word", () => {
  const text = "a".repeat(100) + " " + "b".repeat(100);
  expect(trimDescription(text)).toBe(`${"a".repeat(100)}…`);
});

test("trimDescription prefers a sentence boundary when it keeps most of the text", () => {
  const first = `${"This is the first sentence ".repeat(4).trim()}.`;
  const text = `${first} ${"And a second one that runs on and on ".repeat(5)}`;
  expect(trimDescription(text)).toBe(first);
});

test("descriptions derived from Notion content are trimmed", () => {
  const long = `${"Lorem ipsum dolor sit amet ".repeat(10)}`;
  const recordMap = {
    block: { a: { value: { type: "text", properties: { title: [[long]] } } } },
  } as unknown as NotionRecordMapWithBlocks;
  const description = getDescriptionFromRecordMap(recordMap);
  expect(description?.length).toBeLessThanOrEqual(160);
  expect(description?.endsWith("…")).toBe(true);
  expect(description).not.toContain("...");
});

test("posts without a social image fall back to the generated title card", () => {
  const metadata = buildBlogPostMetadata({
    title: "Gmail URL paste",
    description: "A trick.",
    publishDate: "2024-03-01",
    slug: "gmail-url-paste",
  });
  const card = {
    url: "https://danielwirtz.com/og/blog/gmail-url-paste",
    width: 1200,
    height: 630,
    alt: "Gmail URL paste",
  };
  expect((metadata.openGraph as Og).images).toEqual([card]);
  expect((metadata.twitter as Og).images).toEqual([card]);
});

test("posts use their Notion social image when present", () => {
  const metadata = buildBlogPostMetadata({
    title: "T",
    publishDate: "2024-03-01",
    slug: "t",
    socialImage: "https://file.notion.so/social.png",
  });
  expect((metadata.openGraph as Og).images?.[0]?.url).toBe("https://file.notion.so/social.png");
});

test("posts keep twitter site/creator and title their cards", () => {
  const metadata = buildBlogPostMetadata({
    title: "T",
    description: "D",
    publishDate: "2024-03-01",
    slug: "t",
  });
  expect(metadata.twitter).toMatchObject({
    site: "@wirtzdan",
    creator: "@wirtzdan",
    card: "summary_large_image",
    title: "T – Daniel Wirtz",
    description: "D",
  });
  expect(metadata.openGraph).toMatchObject({
    type: "article",
    title: "T – Daniel Wirtz",
    siteName: "Daniel Wirtz",
  });
});

test("article:modified_time uses the Notion last-edited time", () => {
  const og = buildBlogPostMetadata({
    title: "T",
    publishDate: "2024-03-01",
    modifiedDate: "2025-06-02T10:00:00.000Z",
    slug: "t",
  }).openGraph as Og;
  expect(og.publishedTime).toBe("2024-03-01T00:00:00.000Z");
  expect(og.modifiedTime).toBe("2025-06-02T10:00:00.000Z");
});
