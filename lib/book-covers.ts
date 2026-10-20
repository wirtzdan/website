const EXPIRING_HOSTS = [
  "airtableusercontent.com",
  "dl.airtable.com",
  "prod-files-secure.s3.us-west-2.amazonaws.com",
  "prod-files-secure.s3.amazonaws.com",
  "secure.notion-static.com",
  "file.notion.so",
  "www.notion.so",
  "notion.so",
];

const FETCHABLE_HOSTS = new Set([
  "v5.airtableusercontent.com",
  "dl.airtable.com",
  "covers.openlibrary.org",
]);

export type CoverCandidate = {
  title: string;
  author: string;
  url: string | null;
};

export function normalizeCoverText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function coverKey(title: string, author: string) {
  return `${normalizeCoverText(title)}\n${normalizeCoverText(author)}`;
}

export function isExpiringCoverUrl(url: string) {
  try {
    const hostname = new URL(url).hostname;
    return EXPIRING_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));
  } catch {
    return true;
  }
}

/** A cover the browser can keep requesting without a signed-url refresh. */
export function durableCoverUrl(url: string | null | undefined) {
  if (!url || !url.startsWith("https://") || isExpiringCoverUrl(url)) {
    return null;
  }
  return url;
}

export function isAllowedCoverFetchUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && FETCHABLE_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

export function matchAirtableCover(records: CoverCandidate[], title: string, author: string) {
  const exact = records.find(
    (record) => record.url && coverKey(record.title, record.author) === coverKey(title, author),
  );
  if (exact?.url) {
    return exact.url;
  }

  const sameTitle = records.filter(
    (record) => record.url && normalizeCoverText(record.title) === normalizeCoverText(title),
  );
  if (sameTitle.length === 1) {
    return sameTitle[0]?.url ?? null;
  }

  return null;
}

export function coverUrlFromOpenLibrarySearch(payload: unknown) {
  if (!payload || typeof payload !== "object" || !("docs" in payload)) {
    return null;
  }

  const docs = payload.docs;
  if (!Array.isArray(docs)) {
    return null;
  }

  for (const doc of docs) {
    if (!doc || typeof doc !== "object" || !("cover_i" in doc)) {
      continue;
    }
    const coverId = doc.cover_i;
    if (typeof coverId !== "number" || !Number.isFinite(coverId)) {
      continue;
    }
    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  }

  return null;
}

export function bookCoverProxyPath(title: string, author?: string) {
  const params = new URLSearchParams({ title });
  if (author) {
    params.set("author", author);
  }
  return `/api/book-cover?${params.toString()}`;
}
