import { createRequire } from "node:module";
import { readdirSync } from "node:fs";
import path from "node:path";

import { expect, test } from "vite-plus/test";

import { withMeasuredNotionImages } from "./notion-image-measure";
import {
  frameFromNotionFormat,
  leadingNotionImageSrc,
  mapNotionContentImageUrl,
  unsignedNotionFileUrl,
  withNotionImageFrames,
} from "./notion-image-frame";

const block = { id: "block-1", parent_table: "block" };
const source = "https://example.com/harbour.jpg";

test("reserves a box from width and height, or from the aspect ratio alone", () => {
  expect(frameFromNotionFormat({ block_width: 800, block_height: 400 })).toEqual({
    width: 800,
    height: 400,
  });
  expect(frameFromNotionFormat({ block_width: 800, block_aspect_ratio: 0.5 })).toEqual({
    width: 800,
    height: 400,
  });
  expect(frameFromNotionFormat({ block_aspect_ratio: 0.5 })?.height).toBe(600);
  expect(frameFromNotionFormat(undefined)).toBeNull();
});

test("maps a Notion file the same way react-notion-x looks the preview up", () => {
  const mapped = mapNotionContentImageUrl(source, block);
  const library = libraryMapImageUrl();

  expect(mapped).toBe(
    `https://www.notion.so/image/${encodeURIComponent(source)}?table=block&id=block-1&cache=v2`,
  );
  expect(mapped).toBe(library(source, block));
  expect(mapNotionContentImageUrl("https://images.unsplash.com/photo-1", block)).toBe(
    "https://images.unsplash.com/photo-1",
  );
});

test("stores the frame on the URL the renderer will request", () => {
  const framed = withNotionImageFrames({
    block: {
      "block-1": {
        value: {
          id: "block-1",
          type: "image",
          parent_table: "block",
          format: { block_width: 1200, block_aspect_ratio: 0.75 },
          properties: { source: [[source]] },
        },
      },
      "text-1": {
        value: { id: "text-1", type: "text" },
      },
    },
    signed_urls: {},
  });

  const src = mapNotionContentImageUrl(source, block);
  const previews = (
    framed as { preview_images?: Record<string, { originalWidth: number; originalHeight: number }> }
  ).preview_images;
  expect(previews?.[src ?? ""]).toMatchObject({
    originalWidth: 1200,
    originalHeight: 900,
  });
});

test("measures an image when Notion omits block format", async () => {
  const recordMap = {
    block: {
      "block-1": {
        value: {
          id: "block-1",
          type: "image",
          parent_table: "block",
          format: {},
          properties: { source: [[source]] },
        },
      },
    },
    signed_urls: {},
  };
  const src = mapNotionContentImageUrl(source, block) ?? "";
  const seen: string[] = [];
  const framed = await withMeasuredNotionImages(recordMap, async (url) => {
    seen.push(url);
    return url === src ? { width: 800, height: 600 } : null;
  });
  const previews = (
    framed as { preview_images?: Record<string, { originalWidth: number; originalHeight: number }> }
  ).preview_images;

  expect(seen).toEqual([src]);
  expect(previews?.[src]).toMatchObject({ originalWidth: 1600, originalHeight: 1200 });
});

test("keeps a format frame and does not probe that image", async () => {
  const recordMap = {
    block: {
      "block-1": {
        value: {
          id: "block-1",
          type: "image",
          parent_table: "block",
          format: { block_width: 1200, block_aspect_ratio: 0.75 },
          properties: { source: [[source]] },
        },
      },
    },
  };
  let calls = 0;
  const framed = await withMeasuredNotionImages(recordMap, async () => {
    calls += 1;
    return { width: 10, height: 10 };
  });
  const src = mapNotionContentImageUrl(source, block) ?? "";
  const previews = (
    framed as { preview_images?: Record<string, { originalWidth: number; originalHeight: number }> }
  ).preview_images;

  expect(calls).toBe(0);
  expect(previews?.[src]).toMatchObject({ originalWidth: 1200, originalHeight: 900 });
});

function signedS3(signature: string) {
  return (
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/space-1/file-1/photo.jpeg" +
    "?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cred%2F20261115%2Fus-west-2" +
    `&X-Amz-Date=20261115T000000Z&X-Amz-Expires=3600&X-Amz-Signature=${signature}` +
    "&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject&spaceId=space-1"
  );
}

test("drops the expiring S3 signature so the image URL is stable across Notion fetches", () => {
  const first = mapNotionContentImageUrl(signedS3("aaa"), block);
  const second = mapNotionContentImageUrl(signedS3("bbb"), block);

  expect(first).toBe(second);
  expect(first).toBe(
    `https://www.notion.so/image/${encodeURIComponent(unsignedNotionFileUrl(signedS3("aaa")))}` +
      "?table=block&id=block-1&cache=v2",
  );
  expect(first).not.toMatch(/amz/i);
  expect(unsignedNotionFileUrl(signedS3("aaa"))).toBe(
    "https://prod-files-secure.s3.us-west-2.amazonaws.com/space-1/file-1/photo.jpeg?x-id=GetObject&spaceId=space-1",
  );
});

test("wraps a legacy signed secure.notion-static.com URL instead of shipping the signature", () => {
  const legacy =
    "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/abc/photo.png" +
    "?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cred&X-Amz-Signature=sig";
  const mapped = mapNotionContentImageUrl(legacy, block) ?? "";

  expect(mapped.startsWith("https://www.notion.so/image/")).toBe(true);
  expect(mapped).not.toMatch(/amz/i);
});

test("leaves URLs that are not Notion S3 files alone", () => {
  const external = "https://example.com/a.jpg?X-Amz-Signature=keep";
  expect(unsignedNotionFileUrl(external)).toBe(external);
});

test("picks an image among the first top-level blocks as the leading image", () => {
  const imageBlock = (id: string) => ({
    value: {
      id,
      type: "image",
      parent_table: "block",
      properties: { source: [[signedS3(id)]] },
    },
  });
  const text = (id: string) => ({ value: { id, type: "text" } });
  const page = (content: string[]) => ({ value: { id: "page", type: "page", content } });

  const early = {
    block: {
      page: page(["t1", "img-1", "img-2"]),
      t1: text("t1"),
      "img-1": imageBlock("img-1"),
      "img-2": imageBlock("img-2"),
    },
  };
  expect(leadingNotionImageSrc(early)).toBe(
    mapNotionContentImageUrl(signedS3("img-1"), { id: "img-1", parent_table: "block" }),
  );

  const late = {
    block: {
      page: page(["t1", "t2", "t3", "img-1"]),
      t1: text("t1"),
      t2: text("t2"),
      t3: text("t3"),
      "img-1": imageBlock("img-1"),
    },
  };
  expect(leadingNotionImageSrc(late)).toBeUndefined();
  expect(leadingNotionImageSrc({ block: {} })).toBeUndefined();
});

function libraryMapImageUrl() {
  const root = path.join(process.cwd(), "node_modules/.pnpm");
  const directory = readdirSync(root).find((name) => name.startsWith("react-notion-x@"));
  if (!directory) {
    throw new Error("react-notion-x is not installed");
  }
  const require = createRequire(
    path.join(root, directory, "node_modules/react-notion-x/package.json"),
  );
  const utils = require("notion-utils") as {
    defaultMapImageUrl: (url: string, block: { id: string; parent_table?: string }) => string;
  };
  return utils.defaultMapImageUrl;
}
