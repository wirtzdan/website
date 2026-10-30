import type { Photo, PhotoTrip } from "@/lib/notion/photos";

export type ImageSize = {
  width: number;
  height: number;
};

const NOTION_PROBE_WIDTH = 64;
const DISPLAY_LONG_EDGE = 1600;

export function imageSizeFromBuffer(buffer: Uint8Array): ImageSize | null {
  if (isPng(buffer)) {
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    return { width: view.getUint32(16), height: view.getUint32(20) };
  }

  if (isGif(buffer)) {
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    return { width: view.getUint16(6, true), height: view.getUint16(8, true) };
  }

  const webp = webpSize(buffer);
  if (webp) {
    return webp;
  }

  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    return jpegSize(buffer);
  }

  return heicSize(buffer);
}

export function notionDimensionProbeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const isProxy =
      (parsed.hostname === "www.notion.so" || parsed.hostname === "notion.so") &&
      parsed.pathname.startsWith("/image/");
    if (!isProxy) {
      return null;
    }
    parsed.searchParams.set("width", String(NOTION_PROBE_WIDTH));
    return parsed.toString();
  } catch {
    return null;
  }
}

export function scaleToLongEdge(size: ImageSize, longEdge = DISPLAY_LONG_EDGE): ImageSize {
  const longest = Math.max(size.width, size.height);
  if (longest <= 0) {
    return size;
  }
  const scale = longEdge / longest;
  return {
    width: Math.max(1, Math.round(size.width * scale)),
    height: Math.max(1, Math.round(size.height * scale)),
  };
}

const IMAGE_PROBE_USER_AGENT = "Mozilla/5.0";

export async function readRemoteImageSize(url: string): Promise<ImageSize | null> {
  const probeUrl = notionDimensionProbeUrl(url);
  const target = probeUrl ?? url;
  try {
    const response = await fetch(target, {
      headers: {
        Accept: "image/*",
        // The Notion image proxy answers 403 to the default Node user agent.
        "User-Agent": IMAGE_PROBE_USER_AGENT,
        ...(probeUrl ? {} : { Range: "bytes=0-131071" }),
      },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok && response.status !== 206) {
      return null;
    }
    const size = imageSizeFromBuffer(new Uint8Array(await response.arrayBuffer()));
    if (!size || size.width <= 0 || size.height <= 0) {
      return null;
    }
    return probeUrl ? scaleToLongEdge(size) : size;
  } catch {
    return null;
  }
}

export async function withPhotoDimensions(
  trips: PhotoTrip[],
  readSize: (url: string) => Promise<ImageSize | null> = readRemoteImageSize,
): Promise<PhotoTrip[]> {
  const urls = [...new Set(trips.flatMap((trip) => trip.photos.map((photo) => photo.imageUrl)))];
  const sizes = new Map<string, ImageSize>();

  await runPool(urls, 4, async (url) => {
    const size = await readSize(url);
    if (size) {
      sizes.set(url, size);
    }
  });

  return trips.map((trip) => ({
    ...trip,
    photos: trip.photos.map((photo) => attachSize(photo, sizes.get(photo.imageUrl))),
  }));
}

function attachSize(photo: Photo, size: ImageSize | undefined): Photo {
  if (!size) {
    return photo;
  }
  return { ...photo, width: size.width, height: size.height };
}

async function runPool<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) {
  if (items.length === 0) {
    return;
  }
  let index = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = items[index];
      index += 1;
      await worker(current);
    }
  });
  await Promise.all(runners);
}

function isPng(buffer: Uint8Array) {
  return (
    buffer.length >= 24 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  );
}

function isGif(buffer: Uint8Array) {
  return buffer.length >= 10 && buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;
}

function jpegSize(buffer: Uint8Array): ImageSize | null {
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    if (marker === undefined) {
      return null;
    }
    const isStartOfFrame =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isStartOfFrame) {
      return { height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
    }
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    if (offset + 4 > buffer.length) {
      return null;
    }
    const segmentLength = view.getUint16(offset + 2);
    if (segmentLength < 2) {
      return null;
    }
    offset += 2 + segmentLength;
  }
  return null;
}

function webpSize(buffer: Uint8Array): ImageSize | null {
  if (buffer.length < 30) {
    return null;
  }
  if (ascii(buffer, 0, 4) !== "RIFF" || ascii(buffer, 8, 12) !== "WEBP") {
    return null;
  }
  const format = ascii(buffer, 12, 16);
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  if (format === "VP8X" && buffer.length >= 30) {
    return {
      width: 1 + (buffer[24] + (buffer[25] << 8) + (buffer[26] << 16)),
      height: 1 + (buffer[27] + (buffer[28] << 8) + (buffer[29] << 16)),
    };
  }
  if (format === "VP8 " && buffer.length >= 30) {
    return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
  }
  if (format === "VP8L" && buffer.length >= 25) {
    const bits = view.getUint32(21, true);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}

function heicSize(buffer: Uint8Array): ImageSize | null {
  if (buffer.length < 32 || ascii(buffer, 4, 8) !== "ftyp") {
    return null;
  }
  const brand = ascii(buffer, 8, 12);
  if (
    brand !== "heic" &&
    brand !== "heix" &&
    brand !== "hevc" &&
    brand !== "mif1" &&
    brand !== "msf1"
  ) {
    return null;
  }
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  for (let offset = 12; offset + 16 <= buffer.length; offset += 1) {
    if (ascii(buffer, offset, offset + 4) !== "ispe") {
      continue;
    }
    const width = view.getUint32(offset + 8);
    const height = view.getUint32(offset + 12);
    if (width > 0 && height > 0 && width < 100_000 && height < 100_000) {
      return { width, height };
    }
  }
  return null;
}

function ascii(buffer: Uint8Array, start: number, end: number) {
  let text = "";
  for (let index = start; index < end; index += 1) {
    text += String.fromCharCode(buffer[index] ?? 0);
  }
  return text;
}
