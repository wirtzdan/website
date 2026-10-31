import type { BlogPostSummary } from "@/types/content";

import { absoluteUrl } from "@/lib/site-url";

const FEED_TITLE = "Blog – Daniel Wirtz";
const FEED_DESCRIPTION = "Helpful tools, thoughtful articles and other findings from the web.";

const XML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

/** Escapes text for XML and drops characters XML 1.0 does not allow. */
export function escapeXml(value: string): string {
  return value
    .replace(/[^\t\n\r\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu, "")
    .replace(/[&<>"']/g, (char) => XML_ENTITIES[char]);
}

function toRfc822(date: string): string | null {
  const time = new Date(date).getTime();
  return Number.isNaN(time) ? null : new Date(time).toUTCString();
}

function latestEdit(posts: readonly BlogPostSummary[]): Date | null {
  const times = posts
    .map((post) => new Date(post.modifiedDate ?? post.publishDate).getTime())
    .filter((time) => !Number.isNaN(time));
  return times.length > 0 ? new Date(Math.max(...times)) : null;
}

/** Published posts only (same filter as /blog), newest first. */
export function feedPosts(posts: readonly BlogPostSummary[]): BlogPostSummary[] {
  return posts
    .filter((post) => post.isPublished)
    .sort(
      (left, right) => new Date(right.publishDate).getTime() - new Date(left.publishDate).getTime(),
    );
}

function renderItem(post: BlogPostSummary): string {
  const url = escapeXml(absoluteUrl(`/blog/${post.slug}`));
  const pubDate = toRfc822(post.publishDate);
  return [
    "    <item>",
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${url}</link>`,
    `      <guid isPermaLink="true">${url}</guid>`,
    pubDate ? `      <pubDate>${pubDate}</pubDate>` : null,
    post.description ? `      <description>${escapeXml(post.description)}</description>` : null,
    "    </item>",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

/**
 * RSS 2.0 for every published blog post. `lastBuildDate` is the latest post
 * edit, so the body only changes when the posts do.
 */
export function buildRssFeed(posts: readonly BlogPostSummary[], now = new Date()): string {
  const items = feedPosts(posts);
  const lastBuildDate = (latestEdit(items) ?? now).toUTCString();

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(FEED_TITLE)}</title>`,
    `    <link>${absoluteUrl("/blog")}</link>`,
    `    <description>${escapeXml(FEED_DESCRIPTION)}</description>`,
    "    <language>en</language>",
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml"/>`,
    ...items.map(renderItem),
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
