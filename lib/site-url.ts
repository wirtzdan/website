// The one origin every canonical, og:url and metadataBase is built from.
export const SITE_URL = "https://danielwirtz.com";

export function absoluteUrl(path = "/"): string {
  const trimmed = path.replace(/^\/+/, "");
  return trimmed ? `${SITE_URL}/${trimmed}` : SITE_URL;
}
