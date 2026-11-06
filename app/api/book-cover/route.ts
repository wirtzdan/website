import { bookCoverSourceAttempts } from "@/lib/book-cover-source";
import { usableCoverSources } from "@/lib/book-covers";

// Covers almost never change: keep them at the edge for 30 days and serve stale
// while revalidating, so visitors never wait on Airtable or Open Library.
const COVER_CACHE = "public, max-age=604800, s-maxage=2592000, stale-while-revalidate=31536000";
// Cache a miss briefly so books without covers don't rerun the slow lookup chain on every view.
const MISSING = {
  status: 404,
  headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" },
} as const;
const UPSTREAM_TIMEOUT_MS = 5000;

async function fetchCover(source: string) {
  try {
    const upstream = await fetch(source, {
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    if (!upstream.ok) {
      return null;
    }

    const contentType = upstream.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
    if (!contentType.startsWith("image/")) {
      return null;
    }

    return new Response(await upstream.arrayBuffer(), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": COVER_CACHE,
      },
    });
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title")?.trim() ?? "";
  const author = url.searchParams.get("author")?.trim() ?? "";

  if (!title || title.length > 300 || author.length > 300) {
    return new Response(null, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  for (const attempt of bookCoverSourceAttempts(title, author)) {
    const [source] = usableCoverSources([await attempt()]);
    if (!source) {
      continue;
    }
    const image = await fetchCover(source);
    if (image) {
      return image;
    }
  }

  return new Response(null, MISSING);
}
