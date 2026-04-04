import sorter from "sort-isostring";
import type { FieldSet } from "airtable";

import type { AirtableRecord } from "@/types/content";

interface RssPostFields extends FieldSet {
  slug?: string;
  title?: string;
  description?: string;
  publishDate?: string;
  status?: string;
}

const generateRssItem = (post: AirtableRecord<RssPostFields>) => `
  <item>
    <guid>https://danielwirtz.com/blog/${post.fields.slug}</guid>
    <title>${post.fields.title}</title>
    <link>https://danielwirtz.com/blog/${post.fields.slug}</link>
    <description>${post.fields.description}</description>
    <pubDate>${new Date(post.fields.publishDate ?? "").toUTCString()}</pubDate>
  </item>
`;

const generateRss = (posts: AirtableRecord<RssPostFields>[]) => {
  const sortedPosts = posts
    .filter((post) => post.fields.status === "Published")
    .sort((left, right) =>
      sorter(right.fields.publishDate ?? "", left.fields.publishDate ?? "")
    );

  const latestPublishDate = sortedPosts[0]?.fields.publishDate ?? new Date().toISOString();

  return `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Blog - Daniel Wirtz</title>
      <link>https://danielwirtz.com/blog</link>
      <description>Designer, developer and maker of things.</description>
      <language>en</language>
      <lastBuildDate>${new Date(latestPublishDate).toUTCString()}</lastBuildDate>
      <atom:link href="https://danielwirtz.com/rss.xml" rel="self" type="application/rss+xml"/>
      ${sortedPosts.map(generateRssItem).join("")}
    </channel>
  </rss>
`;
};

export default generateRss;
