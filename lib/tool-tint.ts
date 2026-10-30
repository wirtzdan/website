import { getPalette } from "react-palette";

import type { AirtableImage } from "@/types/content";

import { toolIconUrl } from "./tool-icon";

export async function lightVibrantTint(imageUrl: string): Promise<string | undefined> {
  try {
    const palette = await getPalette(imageUrl);
    return palette.lightVibrant;
  } catch {
    return undefined;
  }
}

export async function toolIconTints(
  images: Array<AirtableImage[] | undefined>,
): Promise<Record<string, string>> {
  const urls = [
    ...new Set(
      images.map((image) => toolIconUrl(image)).filter((url): url is string => Boolean(url)),
    ),
  ];
  const tints: Record<string, string> = {};

  await runPool(urls, 4, async (url) => {
    const tint = await lightVibrantTint(url);
    if (tint) {
      tints[url] = tint;
    }
  });

  return tints;
}

async function runPool<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) {
  if (items.length === 0) {
    return;
  }
  let index = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (index < items.length) {
        const current = items[index];
        index += 1;
        await worker(current);
      }
    }),
  );
}
