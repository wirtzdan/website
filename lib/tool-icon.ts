import type { AirtableImage } from "@/types/content";

export function toolIconUrl(image: AirtableImage[] | undefined): string | undefined {
  const file = image?.[0];
  const url = file?.thumbnails?.large?.url || file?.url;
  if (!url || !url.startsWith("https://")) {
    return undefined;
  }
  return url;
}
