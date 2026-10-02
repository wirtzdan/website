import { expect, test } from "vite-plus/test";

import { groupPhotosByTrip, mapNotionPhoto, type NotionPhotoSource, type Photo } from "./photos";

function row(properties: NotionPhotoSource["properties"], id = "photo-1"): NotionPhotoSource {
  return { id, properties };
}

const trip = { type: "select", select: { name: "Scotland 2026" } };

const externalPhoto = {
  type: "files",
  files: [{ type: "external", external: { url: "https://photos.example/harbour.jpg" } }],
};

function photo(overrides: Partial<Photo> = {}): Photo {
  return {
    id: "photo-1",
    trip: "Scotland 2026",
    imageUrl: "https://photos.example/harbour.jpg",
    caption: null,
    date: "2026-06-01",
    ...overrides,
  };
}

test("skips a row with no image", () => {
  expect(mapNotionPhoto(row({ Trip: trip }))).toBeNull();
  expect(
    mapNotionPhoto(
      row({
        Trip: trip,
        Photo: { type: "files", files: [] },
      }),
    ),
  ).toBeNull();
  expect(
    mapNotionPhoto(
      row({
        Trip: trip,
        Photo: { type: "files", files: [{ type: "file", file: {} }] },
      }),
    ),
  ).toBeNull();
});

test("skips a row with no trip", () => {
  expect(mapNotionPhoto(row({ Photo: externalPhoto }))).toBeNull();
});

test("keeps a photo when the caption is missing", () => {
  const mapped = mapNotionPhoto(row({ Trip: trip, Photo: externalPhoto }));

  expect(mapped).toMatchObject({
    id: "photo-1",
    trip: "Scotland 2026",
    imageUrl: "https://photos.example/harbour.jpg",
    caption: null,
    date: null,
  });
});

test("reads an optional caption", () => {
  const mapped = mapNotionPhoto(
    row({
      Trip: trip,
      Photo: externalPhoto,
      Caption: { type: "rich_text", rich_text: [{ plain_text: "Harbour" }] },
    }),
  );

  expect(mapped?.caption).toBe("Harbour");
});

test("reuses the Notion file URL helper for uploaded photos", () => {
  const mapped = mapNotionPhoto(
    row({
      Trip: trip,
      Photo: {
        type: "files",
        files: [
          {
            type: "file",
            file: {
              url: "https://prod-files-secure.s3.us-west-2.amazonaws.com/abc/image.jpg?X-Amz-Signature=secret",
            },
          },
        ],
      },
    }),
  );

  expect(mapped?.imageUrl).toContain("https://www.notion.so/image/");
  expect(mapped?.imageUrl).toContain("id=photo-1");
  expect(mapped?.imageUrl).not.toContain("X-Amz-Signature");
});

test("groups photos that share a trip and orders trips and photos", () => {
  const trips = groupPhotosByTrip([
    photo({ id: "later", date: "2026-06-02" }),
    photo({ id: "earlier", date: "2026-06-01", caption: "Harbour" }),
    photo({ id: "undated", date: null }),
    photo({
      id: "iceland",
      trip: "Iceland 2024",
      imageUrl: "https://photos.example/iceland.jpg",
      date: "2024-03-01",
    }),
    photo({
      id: "no-date",
      trip: "Loose rolls",
      imageUrl: "https://photos.example/roll.jpg",
      date: null,
    }),
  ]);

  expect(trips.map((group) => group.trip)).toEqual([
    "Scotland 2026",
    "Iceland 2024",
    "Loose rolls",
  ]);
  expect(trips[0]?.photos.map((item) => item.id)).toEqual(["earlier", "later", "undated"]);
  expect(trips[0]?.photos[0]?.caption).toBe("Harbour");
  expect(trips[0]?.photos[2]?.caption).toBeNull();
});

test("orders a calendar date before a later time on the same day", () => {
  const trips = groupPhotosByTrip([
    photo({ id: "noon", date: "2026-06-01T12:00:00.000Z" }),
    photo({ id: "day", date: "2026-06-01" }),
    photo({ id: "next", date: "2026-06-02" }),
  ]);

  expect(trips[0]?.photos.map((item) => item.id)).toEqual(["day", "noon", "next"]);
});

test("breaks a tie on the newest photo by trip name", () => {
  const trips = groupPhotosByTrip([
    photo({ id: "beta", trip: "Beta", date: "2026-01-01" }),
    photo({ id: "alpha", trip: "Alpha", date: "2026-01-01" }),
  ]);

  expect(trips.map((group) => group.trip)).toEqual(["Alpha", "Beta"]);
});
