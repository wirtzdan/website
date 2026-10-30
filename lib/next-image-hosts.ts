const NEXT_IMAGE_HOSTS = new Set([
  "dl.airtable.com",
  "v5.airtableusercontent.com",
  "assets-global.website-files.com",
  "www.notion.so",
  "notion.so",
  "file.notion.so",
  "secure.notion-static.com",
  "images.unsplash.com",
  "prod-files-secure.s3.us-west-2.amazonaws.com",
  "prod-files-secure.s3.amazonaws.com",
]);

export function canUseNextImage(src: string) {
  try {
    const url = new URL(src);
    return url.protocol === "https:" && NEXT_IMAGE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export function isNotionImageProxy(src: string) {
  try {
    const url = new URL(src);
    return (
      url.protocol === "https:" &&
      (url.hostname === "www.notion.so" || url.hostname === "notion.so") &&
      url.pathname.startsWith("/image/")
    );
  } catch {
    return false;
  }
}

// The Notion proxy 403s the Next.js optimizer. Ask the proxy for the width
// and let the browser request that URL directly.
export function notionContentImageLoader({ src, width }: { src: string; width: number }) {
  const url = new URL(src);
  url.searchParams.set("width", String(width));
  return url.toString();
}
