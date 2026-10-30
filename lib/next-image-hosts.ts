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
