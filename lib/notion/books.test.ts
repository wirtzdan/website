import { expect, test } from "vite-plus/test";

import { mapNotionBook, type NotionBookSource } from "./books";

function book(properties: NotionBookSource["properties"]): NotionBookSource {
  return { id: "book-1", properties };
}

const title = { type: "title", title: [{ plain_text: "Dune" }] };

test("skips rows with no title", () => {
  expect(
    mapNotionBook(
      book({ Author: { type: "rich_text", rich_text: [{ plain_text: "Frank Herbert" }] } }),
    ),
  ).toBeNull();
  expect(mapNotionBook(book({ Title: { type: "title", title: [] } }))).toBeNull();
});

test("reads rating as a number", () => {
  const mapped = mapNotionBook(
    book({
      Title: title,
      Rating: { type: "number", number: 4 },
    }),
  );

  expect(mapped?.rating).toBe(4);
  expect(typeof mapped?.rating).toBe("number");
});

test("keeps a missing rating null", () => {
  const mapped = mapNotionBook(book({ Title: title }));
  expect(mapped?.rating).toBeNull();
});

test("keeps Date Read as a date-only string", () => {
  const mapped = mapNotionBook(
    book({
      Title: title,
      "Date Read": {
        type: "date",
        date: { start: "2024-03-01", time_zone: "America/Los_Angeles" },
      },
    }),
  );

  expect(mapped?.dateRead).toBe("2024-03-01");
});

test("trims a datetime Date Read down to the calendar date", () => {
  const mapped = mapNotionBook(
    book({
      Title: title,
      "Date Read": {
        type: "date",
        date: { start: "2024-03-01T15:00:00.000-07:00" },
      },
    }),
  );

  expect(mapped?.dateRead).toBe("2024-03-01");
});

test("reads an external cover URL", () => {
  const mapped = mapNotionBook(
    book({
      Title: title,
      Cover: {
        type: "files",
        files: [{ type: "external", external: { url: "https://covers.example/dune.jpg" } }],
      },
    }),
  );

  expect(mapped?.coverUrl).toBe("https://covers.example/dune.jpg");
});

test("returns null when the cover is missing", () => {
  expect(mapNotionBook(book({ Title: title }))?.coverUrl).toBeNull();
  expect(
    mapNotionBook(
      book({
        Title: title,
        Cover: { type: "files", files: [] },
      }),
    )?.coverUrl,
  ).toBeNull();
});
