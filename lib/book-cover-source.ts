import { unstable_cache } from "next/cache";
import Airtable from "airtable";

import {
  coverUrlFromOpenLibrarySearch,
  matchAirtableCover,
  type CoverCandidate,
} from "@/lib/book-covers";

type AirtableCover = {
  url?: string;
  thumbnails?: {
    large?: { url?: string };
    full?: { url?: string };
  };
};

function attachmentUrl(cover: unknown) {
  const attachment = Array.isArray(cover) ? (cover[0] as AirtableCover | undefined) : undefined;
  return (
    attachment?.thumbnails?.large?.url ||
    attachment?.thumbnails?.full?.url ||
    attachment?.url ||
    null
  );
}

async function loadAirtableCovers(): Promise<CoverCandidate[]> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) {
    return [];
  }

  const records = await new Airtable({ apiKey }).base(baseId)("Books").select({}).all();
  return records.map((record) => ({
    title: String(record.fields.Title ?? ""),
    author: String(record.fields.Author ?? ""),
    url: attachmentUrl(record.fields.Cover),
  }));
}

const getAirtableCovers = unstable_cache(loadAirtableCovers, ["airtable-book-covers-v1"], {
  revalidate: 60 * 30,
});

async function openLibraryCover(title: string, author: string) {
  const query = author ? `title:"${title}" author:"${author}"` : `title:"${title}"`;
  const endpoint = new URL("https://openlibrary.org/search.json");
  endpoint.searchParams.set("q", query);
  endpoint.searchParams.set("limit", "5");
  endpoint.searchParams.set("fields", "title,author_name,cover_i");

  const response = await fetch(endpoint, { next: { revalidate: 60 * 60 * 24 } });
  if (!response.ok) {
    return null;
  }

  return coverUrlFromOpenLibrarySearch(await response.json());
}

async function airtableCover(title: string, author: string) {
  try {
    return matchAirtableCover(await getAirtableCovers(), title, author);
  } catch {
    console.error("Book cover Airtable lookup failed");
    return null;
  }
}

async function openLibraryCoverUrl(title: string, author: string) {
  try {
    return await openLibraryCover(title, author);
  } catch {
    console.error("Book cover Open Library lookup failed");
    return null;
  }
}

/**
 * Lookup order for one cover. The route should fetch each URL and continue
 * when the bytes fail: Airtable signatures expire, and a dead attachment
 * must not hide the Open Library cover.
 */
export function bookCoverSourceAttempts(title: string, author: string) {
  return [() => airtableCover(title, author), () => openLibraryCoverUrl(title, author)];
}
