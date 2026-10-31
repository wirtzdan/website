import { getBlogPosts } from "@/lib/notion/api";
import { buildRssFeed } from "@/lib/rss";

// Same window as the blog routes; POST /api/revalidate refreshes it sooner.
export const revalidate = 3600;

export async function GET() {
  try {
    const posts = await getBlogPosts();
    return new Response(buildRssFeed(posts.results), {
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
