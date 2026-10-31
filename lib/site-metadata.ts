import type { Metadata } from "next";

import { SITE_URL, absoluteUrl } from "@/lib/site-url";

export const SITE_NAME = "Daniel Wirtz";
export const SITE_TAGLINE = "Senior Design Engineer";
export const THEME_COLOR = "#3182CE";
export const TWITTER_HANDLE = "@wirtzdan";

const siteDescription = "Senior Design Engineer at Giving What We Can, based in the Netherlands.";

export const defaultSocialImage = {
  url: absoluteUrl("/static/images/banner.jpg"),
  alt: SITE_NAME,
  width: 2240,
  height: 1260,
};

export const siteMetadata: Metadata = {
  title: { default: SITE_NAME, template: `%s – ${SITE_NAME}` },
  description: siteDescription,
  metadataBase: new URL(SITE_URL),
  manifest: "/static/favicons/site.webmanifest",
  alternates: {
    types: { "application/rss+xml": [{ url: "/rss.xml", title: "Blog – Daniel Wirtz" }] },
  },
  icons: {
    icon: [
      { url: "/static/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/static/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/static/favicons/apple-touch-icon.png",
    shortcut: "/static/favicons/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_IE",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: SITE_NAME,
    description: siteDescription,
    images: [defaultSocialImage],
  },
  twitter: {
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    card: "summary_large_image",
    images: [defaultSocialImage],
  },
  other: {
    "msapplication-TileColor": THEME_COLOR,
    "impact-site-verification": "2096415d-8a81-4e03-9a1f-67bcd203a8c2",
  },
};
