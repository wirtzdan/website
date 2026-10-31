import type { MetadataRoute } from "next";

import { getAllPages, getBlogPosts } from "@/lib/notion/api";
import { siteUrl } from "@/lib/site-metadata";

export const revalidate = 3600;

/** Indexable routes under app/. API routes and error pages are left out. */
const STATIC_ROUTES = [
  "",
  "/about",
  "/blog",
  "/books",
  "/bookmarks",
  "/bread",
  "/fuse-box",
  "/newsletter",
  "/photos",
  "/pizza",
  "/tools",
] as const;

async function blogEntries(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();
  return posts.results
    .filter((post) => post.isPublished)
    .map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.modifiedDate ?? post.publishDate,
    }));
}

async function pageEntries(): Promise<MetadataRoute.Sitemap> {
  const pages = await getAllPages();
  const staticPaths = new Set<string>(STATIC_ROUTES);
  return pages.results
    .filter((page) => page.isPublished && !staticPaths.has(`/${page.slug}`))
    .map((page) => ({ url: `${siteUrl}/${page.slug}` }));
}

/** A failed Notion source drops its entries; the sitemap itself never fails. */
async function settle(
  label: string,
  load: () => Promise<MetadataRoute.Sitemap>,
): Promise<MetadataRoute.Sitemap> {
  try {
    return await load();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Notion API error";
    console.error(`Sitemap: could not load ${label}:`, message);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, pages] = await Promise.all([
    settle("blog posts", blogEntries),
    settle("pages", pageEntries),
  ]);

  return [...STATIC_ROUTES.map((path) => ({ url: `${siteUrl}${path}` })), ...posts, ...pages];
}
