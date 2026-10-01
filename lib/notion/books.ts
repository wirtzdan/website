import type { BookSummary } from "@/types/content";

import { getBooleanProperty, getFilesProperty, getStringProperty } from "./utils";

export type NotionBookSource = {
  id: string;
  properties?: Record<string, any>;
};

const DATE_ONLY = /^(\d{4}-\d{2}-\d{2})/;

export function getBookRating(source: NotionBookSource): number | null {
  const value = source.properties?.Rating;
  if (!value || value.type !== "number" || typeof value.number !== "number") {
    return null;
  }

  return value.number;
}

/** Date-only YYYY-MM-DD. Does not apply the blog post UTC conversion. */
export function getBookDateRead(source: NotionBookSource): string | null {
  const value = source.properties?.["Date Read"];
  if (!value || value.type !== "date" || typeof value.date?.start !== "string") {
    return null;
  }

  const match = DATE_ONLY.exec(value.date.start);
  return match ? match[1] : null;
}

export function mapNotionBook(source: NotionBookSource): BookSummary | null {
  const title = getStringProperty(source, "Title");
  if (!title) {
    return null;
  }

  return {
    id: source.id,
    title,
    author: getStringProperty(source, "Author") ?? "",
    rating: getBookRating(source),
    favorite: getBooleanProperty(source, "Favorite") ?? false,
    read: getBooleanProperty(source, "Read") ?? false,
    dateRead: getBookDateRead(source),
    coverUrl: getFilesProperty(source, "Cover"),
  };
}
