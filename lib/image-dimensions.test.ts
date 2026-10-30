import { expect, test } from "vite-plus/test";

import type { PhotoTrip } from "@/lib/notion/photos";

import {
  imageSizeFromBuffer,
  notionDimensionProbeUrl,
  scaleToLongEdge,
  withPhotoDimensions,
} from "./image-dimensions";

test("reads a PNG header", () => {
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAACAAAAAQCAIAAAD4YuoOAAAAHklEQVR4nGP4z8BAU0Rb00ctGLVg1IJRC0YtoBICAE7E/hC4KNCvAAAAAElFTkSuQmCC",
    "base64",
  );

  expect(imageSizeFromBuffer(png)).toEqual({ width: 32, height: 16 });
});

test("reads an HEIC ispe box", () => {
  const heic = Buffer.from([
    0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63, 0x00, 0x00, 0x00, 0x00,
    0x68, 0x65, 0x69, 0x63, 0x00, 0x00, 0x00, 0x14, 0x69, 0x73, 0x70, 0x65, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x03, 0x20, 0x00, 0x00, 0x02, 0x58,
  ]);

  expect(imageSizeFromBuffer(heic)).toEqual({ width: 800, height: 600 });
});

test("reads a JPEG start-of-frame marker", () => {
  const jpeg = Buffer.from([
    0xff, 0xd8, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x10, 0x00, 0x20, 0x03, 0x01, 0x11, 0x00, 0x02,
    0x11, 0x00, 0x03, 0x11, 0x00,
  ]);

  expect(imageSizeFromBuffer(jpeg)).toEqual({ width: 32, height: 16 });
});

test("asks the Notion image proxy for a small probe", () => {
  const url = notionDimensionProbeUrl(
    "https://www.notion.so/image/https%3A%2F%2Fexample.com%2Fa.jpg?table=block&id=abc&cache=v2",
  );

  expect(url).toContain("width=64");
  expect(url).toContain("table=block");
  expect(notionDimensionProbeUrl("https://example.com/photo.jpg")).toBeNull();
});

test("scales a probe so next/image can request a sharp srcset", () => {
  expect(scaleToLongEdge({ width: 64, height: 32 })).toEqual({ width: 1600, height: 800 });
});

test("attaches dimensions without dropping a photo the probe cannot read", async () => {
  const trips: PhotoTrip[] = [
    {
      trip: "Scotland",
      photos: [
        {
          id: "1",
          trip: "Scotland",
          imageUrl: "https://www.notion.so/image/one",
          caption: null,
          date: null,
        },
        {
          id: "2",
          trip: "Scotland",
          imageUrl: "https://www.notion.so/image/two",
          caption: "Pier",
          date: null,
        },
      ],
    },
  ];

  const sized = await withPhotoDimensions(trips, async (url) =>
    url.endsWith("one") ? { width: 1600, height: 900 } : null,
  );

  expect(sized[0]?.photos[0]).toMatchObject({ width: 1600, height: 900 });
  expect(sized[0]?.photos[1]?.width).toBeUndefined();
  expect(sized[0]?.photos[1]?.caption).toBe("Pier");
});
