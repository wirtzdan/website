import { ImageResponse } from "next/og";

import { SOCIAL_CARD_SIZE } from "@/lib/blog-metadata";
import { getBlogPosts } from "@/lib/notion/api";
import { THEME_COLOR } from "@/lib/site-metadata";

// Title card for posts without a Notion "Social Image" (see blogPostImage).
// A route handler rather than opengraph-image.tsx: file-based images would
// override the Notion image on every post.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.results.find((entry) => entry.slug === slug);

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#ffffff",
        borderTop: `16px solid ${THEME_COLOR}`,
        color: "#1a202c",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: THEME_COLOR }}>Blog</div>
      <div style={{ display: "flex", fontSize: 68, lineHeight: 1.15, letterSpacing: -1 }}>
        {post.title}
      </div>
      <div style={{ display: "flex", fontSize: 30, color: "#4a5568" }}>danielwirtz.com</div>
    </div>,
    {
      ...SOCIAL_CARD_SIZE,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
