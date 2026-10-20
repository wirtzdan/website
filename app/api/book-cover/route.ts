import { isAllowedCoverFetchUrl } from "@/lib/book-covers";
import { resolveBookCoverSource } from "@/lib/book-cover-source";

const MISSING = { status: 404, headers: { "Cache-Control": "no-store" } } as const;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title")?.trim() ?? "";
  const author = url.searchParams.get("author")?.trim() ?? "";

  if (!title || title.length > 300 || author.length > 300) {
    return new Response(null, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const source = await resolveBookCoverSource(title, author);
  if (!source || !isAllowedCoverFetchUrl(source)) {
    return new Response(null, MISSING);
  }

  const upstream = await fetch(source, { cache: "no-store" });
  if (!upstream.ok) {
    return new Response(null, MISSING);
  }

  const contentType = upstream.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
  if (!contentType.startsWith("image/")) {
    return new Response(null, MISSING);
  }

  return new Response(await upstream.arrayBuffer(), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
    },
  });
}
