export type NotionImageFrame = {
  width: number;
  height: number;
};

type NotionFormat = {
  block_width?: number;
  block_height?: number;
  block_aspect_ratio?: number;
};

type NotionBlockValue = {
  id?: string;
  type?: string;
  parent_table?: string;
  space_id?: string;
  format?: NotionFormat;
  properties?: {
    source?: Array<[string] | string>;
  };
};

type WrappedBlock = {
  role?: string;
  value?: NotionBlockValue | { value?: NotionBlockValue };
};

type PreviewImage = {
  originalWidth: number;
  originalHeight: number;
  dataURIBase64: string;
};

type FrameRecordMap = {
  block?: Record<string, unknown>;
  signed_urls?: Record<string, string>;
  preview_images?: Record<string, PreviewImage | null>;
};

const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const NOMINAL_WIDTH = 1200;

export function frameFromNotionFormat(
  format: NotionFormat | null | undefined,
): NotionImageFrame | null {
  const width = positive(format?.block_width);
  const height = positive(format?.block_height);
  const ratio = positive(format?.block_aspect_ratio);

  if (width && height) {
    return { width: Math.round(width), height: Math.round(height) };
  }
  if (width && ratio) {
    return { width: Math.round(width), height: Math.max(1, Math.round(width * ratio)) };
  }
  if (height && ratio) {
    return { width: Math.max(1, Math.round(height / ratio)), height: Math.round(height) };
  }
  if (ratio) {
    return { width: NOMINAL_WIDTH, height: Math.max(1, Math.round(NOMINAL_WIDTH * ratio)) };
  }
  return null;
}

// S3 query parameters that sign a Notion file URL. They change on every Notion
// fetch and expire after about an hour.
function isSignatureParam(key: string) {
  return key.toLowerCase().startsWith("x-amz-");
}

function isNotionS3File(url: URL) {
  return (
    url.hostname.endsWith(".amazonaws.com") &&
    (url.pathname.startsWith("/secure.notion-static.com") ||
      url.hostname.startsWith("prod-files-secure"))
  );
}

/**
 * Drops the expiring S3 signature from a Notion file URL. Notion's image
 * endpoint signs the file itself from the table/id permission record, so the
 * unsigned URL keeps working and stays the same between Notion fetches.
 */
export function unsignedNotionFileUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (!isNotionS3File(parsed)) {
      return url;
    }
    for (const key of Array.from(parsed.searchParams.keys())) {
      if (isSignatureParam(key)) {
        parsed.searchParams.delete(key);
      }
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Maps a Notion image source to a stable www.notion.so/image URL.
 *
 * Mirrors react-notion-x's defaultMapImageUrl, with one difference: signed S3
 * URLs lose their signature instead of being embedded as-is. The library
 * version bakes the hourly signature into the src, so the URL changed on every
 * revalidation and browsers re-downloaded every image. NotionPageView passes
 * this function to the renderer as mapImageUrl, so the preview_images keys
 * written here match the src the renderer asks for.
 */
export function mapNotionContentImageUrl(
  url: string | undefined,
  block: { id?: string; parent_table?: string },
): string | undefined {
  if (!url) {
    return undefined;
  }
  if (url.startsWith("data:")) {
    return url;
  }
  if (url.startsWith("https://images.unsplash.com")) {
    return url;
  }
  try {
    new URL(url, "https://www.notion.so");
  } catch {
    return undefined;
  }

  let mapped = unsignedNotionFileUrl(url);
  if (mapped.startsWith("/images")) {
    mapped = `https://www.notion.so${mapped}`;
  }
  mapped = `https://www.notion.so${
    mapped.startsWith("/image") ? mapped : `/image/${encodeURIComponent(mapped)}`
  }`;

  const notionImageUrl = new URL(mapped);
  let table = block.parent_table === "space" ? "block" : block.parent_table;
  if (table === "collection" || table === "team") {
    table = "block";
  }
  notionImageUrl.searchParams.set("table", table === undefined ? "undefined" : table);
  notionImageUrl.searchParams.set("id", block.id ?? "");
  notionImageUrl.searchParams.set("cache", "v2");
  return notionImageUrl.toString();
}

export type NotionImageTarget = {
  src: string;
  raw: string;
};

export function notionImageTargets(recordMap: unknown): NotionImageTarget[] {
  const source = recordMap as FrameRecordMap;
  const targets: NotionImageTarget[] = [];
  for (const [blockId, entry] of Object.entries(source.block ?? {})) {
    const block = unwrapBlock(entry as WrappedBlock | NotionBlockValue);
    if (!block || block.type !== "image") {
      continue;
    }
    const resolved = resolveImage(source, blockId, block);
    if (resolved) {
      targets.push(resolved);
    }
  }
  return targets;
}

type PageBlockValue = NotionBlockValue & { content?: string[] };

/**
 * The src of an image among the first few top-level blocks of a page, if any.
 * On a phone that image sits in or near the first viewport and is usually the
 * LCP element, so it should load eagerly with high fetch priority.
 */
export function leadingNotionImageSrc(recordMap: unknown, maxBlocks = 3): string | undefined {
  const source = recordMap as FrameRecordMap;
  const blocks = source.block ?? {};
  const pageId = Object.keys(blocks)[0];
  if (!pageId) {
    return undefined;
  }
  const page = unwrapBlock(blocks[pageId] as WrappedBlock | NotionBlockValue) as PageBlockValue;
  for (const childId of (page?.content ?? []).slice(0, maxBlocks)) {
    const child = unwrapBlock(blocks[childId] as WrappedBlock | NotionBlockValue | undefined);
    if (child?.type === "image") {
      return resolveImage(source, childId, child)?.src;
    }
  }
  return undefined;
}

export function withNotionImageFrames<T>(recordMap: T): T {
  const source = recordMap as T & FrameRecordMap;
  const previewImages: Record<string, PreviewImage | null> = { ...source.preview_images };

  for (const [blockId, entry] of Object.entries(source.block ?? {})) {
    const block = unwrapBlock(entry as WrappedBlock | NotionBlockValue);
    if (!block || block.type !== "image") {
      continue;
    }
    const frame = frameFromNotionFormat(block.format);
    const resolved = resolveImage(source, blockId, block);
    if (!frame || !resolved) {
      continue;
    }
    writePreview(previewImages, resolved.src, frame);
  }

  return { ...source, preview_images: previewImages };
}

export function withMeasuredImageFrames<T>(
  recordMap: T,
  sizes: ReadonlyMap<string, NotionImageFrame>,
): T {
  const source = recordMap as T & FrameRecordMap;
  const previewImages: Record<string, PreviewImage | null> = { ...source.preview_images };
  for (const [src, frame] of sizes) {
    writePreview(previewImages, src, frame);
  }
  return { ...source, preview_images: previewImages };
}

function writePreview(
  previewImages: Record<string, PreviewImage | null>,
  src: string,
  frame: NotionImageFrame,
) {
  const existing = previewImages[src];
  if (existing?.originalWidth && existing?.originalHeight) {
    return;
  }
  if (frame.width <= 0 || frame.height <= 0) {
    return;
  }
  previewImages[src] = {
    originalWidth: Math.round(frame.width),
    originalHeight: Math.round(frame.height),
    dataURIBase64: TRANSPARENT_PIXEL,
  };
}

function resolveImage(
  recordMap: FrameRecordMap,
  blockId: string,
  block: NotionBlockValue,
): NotionImageTarget | undefined {
  const propertySource = readSource(block);
  let source = recordMap.signed_urls?.[block.id ?? blockId] || propertySource;
  if (!source) {
    return undefined;
  }
  if (block.space_id) {
    try {
      const url = new URL(source);
      url.searchParams.set("spaceId", block.space_id);
      source = url.toString();
    } catch {
      // Keep the original source when it is not an absolute URL.
    }
  }
  if (source.includes("file.notion.so") && propertySource) {
    source = propertySource;
  }
  const src = mapNotionContentImageUrl(source, {
    id: block.id ?? blockId,
    parent_table: block.parent_table,
  });
  if (!src) {
    return undefined;
  }
  return { src, raw: source };
}

function readSource(block: NotionBlockValue) {
  const source = block.properties?.source?.[0];
  if (Array.isArray(source)) {
    return source[0];
  }
  return typeof source === "string" ? source : undefined;
}

function unwrapBlock(entry: WrappedBlock | NotionBlockValue | undefined): NotionBlockValue | null {
  if (!entry) {
    return null;
  }
  if ("value" in entry && entry.value && typeof entry.value === "object") {
    const value = entry.value as NotionBlockValue & { value?: NotionBlockValue };
    if (value.value && typeof value.value === "object" && "type" in value.value) {
      return value.value;
    }
    return value;
  }
  return entry as NotionBlockValue;
}

function positive(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}
