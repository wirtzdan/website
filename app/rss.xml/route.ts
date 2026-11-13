import { loadBlogPosts } from "@/lib/notion/api";
import { buildRssFeed } from "@/lib/rss";

/**
 * Built once per deploy and kept until POST /api/revalidate calls
 * revalidatePath("/rss.xml"). There is no time-based revalidate, so visitors
 * and feed readers never trigger a rebuild.
 *
 * The posts come from loadBlogPosts, not the cached getBlogPosts: that
 * data cache has a 3600s revalidate, which Next would copy onto this route
 * and turn it back into an hourly ISR rebuild. Descriptions come from the
 * Notion property only; no post bodies are fetched.
 */
export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  // Let a Notion error throw. At build time that fails the deploy and the
  // previous one stays live; on revalidation Next keeps serving the last feed.
  // A returned error response would be cached as the feed instead.
  const posts = await loadBlogPosts();
  return new Response(buildRssFeed(posts), {
    headers: { "Content-Type": "application/xml" },
  });
}
