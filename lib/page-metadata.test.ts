import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test } from "vite-plus/test";

import * as pages from "@/lib/page-metadata";
import { THEME_COLOR, siteMetadata } from "@/lib/site-metadata";

test("home title is brand-first and not templated", () => {
  expect(pages.homeMetadata.title).toEqual({ absolute: "Daniel Wirtz – Senior Design Engineer" });
  expect(pages.homeMetadata.openGraph).toMatchObject({
    url: "https://danielwirtz.com",
    title: "Daniel Wirtz – Senior Design Engineer",
  });
});

test("each static page has its own Open Graph and Twitter card", () => {
  const all = Object.values(pages).filter((value) => typeof value === "object");
  expect(all.length).toBe(11);
  const ogTitles = new Set<unknown>();
  for (const metadata of all) {
    const og = metadata.openGraph as Record<string, unknown>;
    const twitter = metadata.twitter as Record<string, unknown>;
    expect(og.url).toBe(metadata.alternates?.canonical);
    expect(og.description).toBe(metadata.description);
    expect(og.images).toEqual(siteMetadata.openGraph?.images);
    expect(twitter).toMatchObject({
      site: "@wirtzdan",
      creator: "@wirtzdan",
      card: "summary_large_image",
      title: og.title,
      description: metadata.description,
    });
    ogTitles.add(og.title);
  }
  expect(ogTitles.size).toBe(all.length);
  expect(pages.aboutMetadata.openGraph).toMatchObject({
    url: "https://danielwirtz.com/about",
    title: "About – Daniel Wirtz",
  });
});

test("theme colour is #3182CE everywhere", () => {
  const manifest = JSON.parse(
    readFileSync(join(process.cwd(), "public/static/favicons/site.webmanifest"), "utf8"),
  );
  expect(THEME_COLOR).toBe("#3182CE");
  expect(manifest.theme_color).toBe(THEME_COLOR);
  expect((siteMetadata.other as Record<string, string>)["msapplication-TileColor"]).toBe(
    THEME_COLOR,
  );
  expect(manifest.name).toBe("Daniel Wirtz");
  expect(manifest.short_name).toBe("Daniel Wirtz");
});

test("every icon, manifest and image URL points at a file in public/", () => {
  const manifest = JSON.parse(
    readFileSync(join(process.cwd(), "public/static/favicons/site.webmanifest"), "utf8"),
  );
  const icons = siteMetadata.icons as {
    icon: { url: string }[];
    apple: string;
    shortcut: string;
  };
  const paths = [
    siteMetadata.manifest as string,
    ...icons.icon.map((icon) => icon.url),
    icons.apple,
    icons.shortcut,
    ...manifest.icons.map((icon: { src: string }) => icon.src),
    "/static/images/banner.jpg",
    ...Object.values(siteMetadata.other ?? {}).filter(
      (value): value is string => typeof value === "string" && value.startsWith("/"),
    ),
  ];
  for (const path of paths) {
    expect(existsSync(join(process.cwd(), "public", path)), path).toBe(true);
  }
});
