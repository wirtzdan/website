import type { Metadata } from "next";

import { SITE_URL, absoluteUrl } from "@/lib/site-url";

const siteTitle = "Daniel Wirtz";
const siteDescription = "Senior Design Engineer at Giving What We Can, based in the Netherlands.";

export const siteMetadata: Metadata = {
  title: { default: siteTitle, template: "%s – Daniel Wirtz" },
  description: siteDescription,
  metadataBase: new URL(SITE_URL),
  manifest: "/static/favicons/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "96x96", type: "image/png" },
      { url: "/static/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/static/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/static/favicons/apple-touch-icon.png",
    shortcut: "/static/favicons/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: SITE_URL,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: absoluteUrl("/static/images/banner.jpg"),
        alt: siteTitle,
        width: 2240,
        height: 1260,
      },
    ],
  },
  twitter: {
    site: "@wirtzdan",
    creator: "@wirtzdan",
    card: "summary_large_image",
  },
  other: {
    "msapplication-TileColor": "#3182CE",
    "msapplication-config": "/static/favicons/browserconfig.xml",
    "impact-site-verification": "2096415d-8a81-4e03-9a1f-67bcd203a8c2",
  },
};
