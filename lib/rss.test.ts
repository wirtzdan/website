import { expect, test } from "vite-plus/test";

import { buildBlogPostMetadata } from "@/lib/blog-metadata";
import {
  aboutMetadata,
  blogIndexMetadata,
  buildPageMetadata,
  homeMetadata,
} from "@/lib/page-metadata";
import { siteMetadata } from "@/lib/site-metadata";
import type { BlogPostSummary } from "@/types/content";

import { buildRssFeed, escapeXml, feedPosts } from "./rss";

type XmlElement = {
  name: string;
  attributes: Record<string, string>;
  children: XmlElement[];
  text: string;
};

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

function decode(raw: string): string {
  if (/&(?![\w#]+;)/.test(raw)) throw new Error("Bare &");
  return raw.replace(/&([^;]*);/g, (_, entity: string) => {
    if (entity in ENTITIES) return ENTITIES[entity];
    if (/^#x[0-9a-f]+$/i.test(entity)) return String.fromCodePoint(parseInt(entity.slice(2), 16));
    if (/^#\d+$/.test(entity)) return String.fromCodePoint(Number(entity.slice(1)));
    throw new Error(`Unknown entity &${entity};`);
  });
}

/** Strict enough for a feed: balanced tags, quoted attributes, no bare `&` or `<`. */
function parseXml(xml: string): XmlElement {
  const body = xml.replace(/^<\?xml [^?]*\?>\s*/, "");
  const stack: XmlElement[] = [{ name: "#document", attributes: {}, children: [], text: "" }];
  const tokens = body.match(/<!\[CDATA\[[\s\S]*?\]\]>|<[^>]*>|[^<]+/g) ?? [];
  if (tokens.join("") !== body) throw new Error("Stray markup");

  for (const token of tokens) {
    const current = stack[stack.length - 1];
    if (token.startsWith("<![CDATA[")) {
      current.text += token.slice(9, -3);
    } else if (token.startsWith("</")) {
      const closed = stack.pop();
      if (closed?.name !== token.slice(2, -1)) throw new Error(`Mismatched ${token}`);
    } else if (token.startsWith("<")) {
      const match = /^<([\w:-]+)((?:\s+[\w:-]+="[^"<]*")*)\s*(\/?)>$/.exec(token);
      if (!match) throw new Error(`Malformed tag ${token}`);
      const attributes: Record<string, string> = {};
      for (const [, key, value] of match[2].matchAll(/([\w:-]+)="([^"]*)"/g)) {
        attributes[key] = decode(value);
      }
      const element: XmlElement = { name: match[1], attributes, children: [], text: "" };
      current.children.push(element);
      if (!match[3]) stack.push(element);
    } else {
      if (token.includes("<")) throw new Error("Bare <");
      current.text += decode(token);
    }
  }

  const [document] = stack;
  if (stack.length !== 1 || document.children.length !== 1) throw new Error("Unbalanced XML");
  if (document.text.trim()) throw new Error("Text outside the root element");
  return document.children[0];
}

function child(element: XmlElement, name: string): XmlElement | undefined {
  return element.children.find((node) => node.name === name);
}

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

function items(xml: string): XmlElement[] {
  const channel = child(parseXml(xml), "channel");
  return channel?.children.filter((node) => node.name === "item") ?? [];
}

test("escapes XML special characters and strips control characters", () => {
  expect(escapeXml(`Tom & "Jerry" <b>'s</b>`)).toBe(
    "Tom &amp; &quot;Jerry&quot; &lt;b&gt;&apos;s&lt;/b&gt;",
  );
  expect(escapeXml("a\u0000b\u000Bc\td\ne\uFFFE\uD800f")).toBe("abc\td\nef");
  expect(escapeXml("emoji 🍕 stays")).toBe("emoji 🍕 stays");
});

test("builds a well-formed RSS 2.0 channel", () => {
  const xml = buildRssFeed([post("hello", { modifiedDate: "2024-02-03T04:05:06.000Z" })]);
  const rss = parseXml(xml);

  expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  expect(rss.name).toBe("rss");
  expect(rss.attributes.version).toBe("2.0");

  const channel = child(rss, "channel")!;
  expect(child(channel, "title")?.text).toBe("Blog – Daniel Wirtz");
  expect(child(channel, "link")?.text).toBe("https://danielwirtz.com/blog");
  expect(child(channel, "description")?.text).not.toBe("");
  expect(child(channel, "language")?.text).toBe("en");
  expect(child(channel, "lastBuildDate")?.text).toBe("Sat, 03 Feb 2024 04:05:06 GMT");
  expect(child(channel, "atom:link")?.attributes).toEqual({
    href: "https://danielwirtz.com/rss.xml",
    rel: "self",
    type: "application/rss+xml",
  });
});

test("items carry absolute permalinks, RFC 822 dates and escaped text", () => {
  const xml = buildRssFeed([
    post("ampersands", {
      title: "Fish & <Chips>",
      description: 'Use "quotes" & </description> tags',
      publishDate: "2025-06-01",
    }),
  ]);
  const [item] = items(xml);

  expect(child(item, "title")?.text).toBe("Fish & <Chips>");
  expect(child(item, "description")?.text).toBe('Use "quotes" & </description> tags');
  expect(child(item, "link")?.text).toBe("https://danielwirtz.com/blog/ampersands");
  expect(child(item, "guid")?.text).toBe("https://danielwirtz.com/blog/ampersands");
  expect(child(item, "guid")?.attributes.isPermaLink).toBe("true");
  expect(child(item, "pubDate")?.text).toBe("Sun, 01 Jun 2025 00:00:00 GMT");
});

test("leaves out drafts and lists posts newest first", () => {
  const posts = [
    post("older", { publishDate: "2022-03-01" }),
    post("draft", { publishDate: "2026-01-01", isPublished: false }),
    post("newest", { publishDate: "2025-10-20" }),
    post("middle", { publishDate: "2024-07-15" }),
  ];

  expect(feedPosts(posts).map((entry) => entry.slug)).toEqual(["newest", "middle", "older"]);
  const links = items(buildRssFeed(posts)).map((item) => child(item, "link")?.text);
  expect(links).toEqual([
    "https://danielwirtz.com/blog/newest",
    "https://danielwirtz.com/blog/middle",
    "https://danielwirtz.com/blog/older",
  ]);
  expect(buildRssFeed(posts)).not.toContain("draft");
});

test("an empty list is still a valid feed", () => {
  const now = new Date("2026-10-31T12:00:00.000Z");
  const xml = buildRssFeed([post("draft", { isPublished: false })], now);

  expect(items(xml)).toHaveLength(0);
  expect(child(child(parseXml(xml), "channel")!, "lastBuildDate")?.text).toBe(now.toUTCString());
});

test("every page keeps the feed link next to its canonical URL", () => {
  const feed = siteMetadata.alternates?.types?.["application/rss+xml"];
  expect(feed).toEqual([{ url: "/rss.xml", title: "Blog – Daniel Wirtz" }]);

  const postMetadata = buildBlogPostMetadata({
    title: "Hello",
    description: null,
    publishDate: "2024-01-01",
    slug: "hello",
  });
  const notionPage = buildPageMetadata({ title: "Now", description: "Now", path: "/now" });
  for (const metadata of [
    homeMetadata,
    aboutMetadata,
    blogIndexMetadata,
    postMetadata,
    notionPage,
  ]) {
    expect(metadata.alternates?.types?.["application/rss+xml"]).toEqual(feed);
    expect(metadata.alternates?.canonical).toMatch(/^https:\/\/danielwirtz\.com/);
  }
});
