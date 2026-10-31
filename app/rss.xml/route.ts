import { getDescriptionFromRecordMap } from "@/lib/blog-metadata";
import { getBlogPosts, getPageByPageId } from "@/lib/notion/api";
import { buildRssFeed, feedPosts } from "@/lib/rss";
import type { BlogPostSummary } from "@/types/content";

// Same window as the blog routes; POST /api/revalidate refreshes it sooner.
export const revalidate = 3600;

/**
 * Same description as the post's meta tag: the Notion property, else the
 * first paragraph. Page bodies come from the shared data cache. A post whose
 * body fails to load keeps its item, just without a description.
 */
async function withDescription(post: BlogPostSummary): Promise<BlogPostSummary> {
  if (post.description) {
    return post;
  }
  try {
    const recordMap = await getPageByPageId(post.id);
    return { ...post, description: getDescriptionFromRecordMap(recordMap) ?? null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Notion API error";
    console.error(`RSS: could not load the description for ${post.slug}:`, message);
    return post;
  }
}

export async function GET() {
  try {
    const posts = await getBlogPosts();
    const items = await Promise.all(feedPosts(posts.results).map(withDescription));
    return new Response(buildRssFeed(items), {
      headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Notion API error";
    console.error("RSS: could not load blog posts:", message);
    return new Response("The feed is temporarily unavailable.", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "Retry-After": "300",
      },
    });
  }
}
