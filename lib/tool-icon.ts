import type { AirtableImage, AirtableRecord, ToolFields } from "@/types/content";

const RECORD_ID = /^rec[A-Za-z0-9]{14}$/;
const ATTACHMENT_ID = /^att[A-Za-z0-9]{14}$/;
const FETCHABLE_HOSTS = new Set(["v5.airtableusercontent.com", "dl.airtable.com"]);

/** The Airtable URL of a tool's icon. Signed, so it expires after a few hours. */
export function toolIconUrl(image: AirtableImage[] | undefined): string | undefined {
  const file = image?.[0];
  const url = file?.thumbnails?.large?.url || file?.url;
  if (!url || !url.startsWith("https://")) {
    return undefined;
  }
  return url;
}

/**
 * A stable, same-origin URL for a tool's icon. The page must not embed the
 * signed Airtable URL: an hour-old ISR render can outlive it and every icon
 * breaks (issue #30). The attachment id changes when the icon is replaced,
 * so the proxy response can be cached for a long time.
 */
export function toolIconProxyPath(
  recordId: string,
  image: AirtableImage[] | undefined,
): string | undefined {
  const fileId = image?.[0]?.id;
  if (!toolIconUrl(image) || !fileId || !isToolIconRequest(recordId, fileId)) {
    return undefined;
  }
  const params = new URLSearchParams({ record: recordId, file: fileId });
  return `/api/tool-icon?${params.toString()}`;
}

export function isToolIconRequest(recordId: string, fileId: string) {
  return RECORD_ID.test(recordId) && ATTACHMENT_ID.test(fileId);
}

/** The current signed URL for a record's icon, if it still is that attachment. */
export function toolIconSource(
  records: AirtableRecord<ToolFields>[],
  recordId: string,
  fileId: string,
): string | undefined {
  const image = records.find((record) => record.id === recordId)?.fields.Image;
  if (image?.[0]?.id !== fileId) {
    return undefined;
  }
  const url = toolIconUrl(image);
  if (!url) {
    return undefined;
  }
  try {
    return FETCHABLE_HOSTS.has(new URL(url).hostname) ? url : undefined;
  } catch {
    return undefined;
  }
}
