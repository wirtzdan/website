import { expect, test } from "vite-plus/test";

import {
  bookCoverProxyPath,
  coverUrlFromOpenLibrarySearch,
  durableCoverUrl,
  isAllowedCoverFetchUrl,
  isExpiringCoverUrl,
  matchAirtableCover,
} from "./book-covers";

const records = [
  {
    title: "Dune",
    author: "Frank Herbert",
    url: "https://v5.airtableusercontent.com/v3/u/58/58/1/abc/cover.jpg",
  },
  {
    title: "Dune",
    author: "Someone Else",
    url: "https://v5.airtableusercontent.com/v3/u/58/58/1/def/other.jpg",
  },
  {
    title: "  Station Eleven ",
    author: "Emily St. John Mandel",
    url: "https://dl.airtable.com/station.jpg",
  },
];

test("matches a fresh Airtable cover by title and author", () => {
  expect(matchAirtableCover(records, "Dune", "Frank Herbert")).toContain("abc/cover.jpg");
  expect(matchAirtableCover(records, "dune", " frank herbert ")).toContain("abc/cover.jpg");
});

test("uses a unique title when the author text does not match", () => {
  expect(matchAirtableCover(records, "Station Eleven", "E. Mandel")).toBe(
    "https://dl.airtable.com/station.jpg",
  );
});

test("does not guess when two books share a title", () => {
  expect(matchAirtableCover(records, "Dune", "Unknown")).toBeNull();
});

test("treats signed Notion and Airtable hosts as expiring", () => {
  expect(isExpiringCoverUrl("https://v5.airtableusercontent.com/v3/u/58/58/1/abc/cover.jpg")).toBe(
    true,
  );
  expect(
    isExpiringCoverUrl(
      "https://prod-files-secure.s3.us-west-2.amazonaws.com/file.jpg?X-Amz-Signature=abc",
    ),
  ).toBe(true);
  expect(durableCoverUrl("https://covers.openlibrary.org/b/id/499877-L.jpg")).toBe(
    "https://covers.openlibrary.org/b/id/499877-L.jpg",
  );
  expect(durableCoverUrl("https://v5.airtableusercontent.com/expired.jpg")).toBeNull();
});

test("only fetches cover bytes from known image hosts", () => {
  expect(isAllowedCoverFetchUrl("https://covers.openlibrary.org/b/id/1-L.jpg")).toBe(true);
  expect(isAllowedCoverFetchUrl("https://example.com/cover.jpg")).toBe(false);
  expect(isAllowedCoverFetchUrl("http://covers.openlibrary.org/b/id/1-L.jpg")).toBe(false);
});

test("reads an Open Library cover id", () => {
  expect(coverUrlFromOpenLibrarySearch({ docs: [{ cover_i: 499877 }] })).toBe(
    "https://covers.openlibrary.org/b/id/499877-L.jpg",
  );
  expect(coverUrlFromOpenLibrarySearch({ docs: [{}] })).toBeNull();
  expect(coverUrlFromOpenLibrarySearch(null)).toBeNull();
});

test("builds a stable same-origin cover path", () => {
  expect(bookCoverProxyPath("Wild Dark Shore", "Charlotte McConaghy")).toBe(
    "/api/book-cover?title=Wild+Dark+Shore&author=Charlotte+McConaghy",
  );
});
