import { readRemoteImageSize, scaleToLongEdge, type ImageSize } from "@/lib/image-dimensions";
import {
  notionImageTargets,
  withMeasuredImageFrames,
  withNotionImageFrames,
  type NotionImageFrame,
} from "@/lib/notion-image-frame";

type ReadSize = (url: string) => Promise<ImageSize | null>;

export async function withMeasuredNotionImages<T>(
  recordMap: T,
  readSize: ReadSize = readRemoteImageSize,
): Promise<T> {
  const framed = withNotionImageFrames(recordMap);
  const previews = (framed as { preview_images?: Record<string, { originalWidth?: number }> })
    .preview_images;
  const missing = notionImageTargets(framed).filter((target) => {
    const existing = previews?.[target.src];
    return !(existing?.originalWidth && existing.originalWidth > 0);
  });
  if (missing.length === 0) {
    return framed;
  }

  const sizes = new Map<string, NotionImageFrame>();
  await runPool(missing, 4, async (target) => {
    const measured =
      (await readSize(target.src)) ??
      (target.raw !== target.src ? await readSize(target.raw) : null);
    if (!measured || measured.width <= 0 || measured.height <= 0) {
      return;
    }
    sizes.set(target.src, scaleToLongEdge(measured));
  });

  return withMeasuredImageFrames(framed, sizes);
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
