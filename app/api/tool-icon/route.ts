import { getFreshTools, getTable, type ToolFields } from "@/lib/airtable";
import { isToolIconRequest, toolIconSource } from "@/lib/tool-icon";

// The URL names the Airtable attachment, which changes when the icon is
// replaced, so a response can stay at the edge for a long time.
const ICON_CACHE = "public, max-age=604800, s-maxage=2592000, stale-while-revalidate=31536000";
const MISSING = {
  status: 404,
  headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
} as const;
const UPSTREAM_TIMEOUT_MS = 5000;

async function fetchIcon(source: string) {
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
      headers: { "Content-Type": contentType, "Cache-Control": ICON_CACHE },
    });
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const recordId = url.searchParams.get("record") ?? "";
  const fileId = url.searchParams.get("file") ?? "";

  if (!isToolIconRequest(recordId, fileId)) {
    return new Response(null, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  // The cached table can hold a signed URL that has already expired. Only
  // when the icon is known but its URL fails, ask Airtable for a fresh one.
  // Unknown ids never reach Airtable.
  const cached = toolIconSource(await getTable<ToolFields>("Tools"), recordId, fileId);
  if (!cached) {
    return new Response(null, MISSING);
  }
  const icon = await fetchIcon(cached);
  if (icon) {
    return icon;
  }

  const fresh = toolIconSource(await getFreshTools(), recordId, fileId);
  if (fresh && fresh !== cached) {
    const retried = await fetchIcon(fresh);
    if (retried) {
      return retried;
    }
  }
  return new Response(null, MISSING);
}
