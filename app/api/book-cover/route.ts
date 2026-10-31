import { bookCoverSourceAttempts } from "@/lib/book-cover-source";
import { usableCoverSources } from "@/lib/book-covers";

const MISSING = { status: 404, headers: { "Cache-Control": "no-store" } } as const;

async function fetchCover(source: string) {
  try {
    const upstream = await fetch(source, { cache: "no-store" });
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
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
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
