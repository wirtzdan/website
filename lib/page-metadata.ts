import type { Metadata } from "next";

import { siteMetadata } from "@/lib/site-metadata";
import { absoluteUrl } from "@/lib/site-url";

// Pages inherit the site's Open Graph tags, so only the URL needs to change.
// Next.js merges metadata shallowly: `alternates` (the RSS link) and `openGraph`
// have to be spread, not replaced.
export function pageUrls(path: string): Pick<Metadata, "alternates" | "openGraph"> {
  const url = absoluteUrl(path);
  return {
    alternates: { ...siteMetadata.alternates, canonical: url },
    openGraph: { ...siteMetadata.openGraph, url },
  };
}

export const homeMetadata: Metadata = {
  title: "Home",
  description:
    "Daniel Wirtz — Senior Design Engineer at Giving What We Can. Latest posts, books, bookmarks, and articles from the Netherlands.",
  ...pageUrls("/"),
};

export const aboutMetadata: Metadata = {
  title: "About",
  description:
    "About Daniel Wirtz, Senior Design Engineer at Giving What We Can: experience, what I like (and dislike), and how this site is built.",
  ...pageUrls("/about"),
};

export const blogIndexMetadata: Metadata = {
  title: "Blog",
  description: "Helpful tools, thoughtful articles and other findings from the web.",
  ...pageUrls("/blog"),
};

export const toolsMetadata: Metadata = {
  title: "Tools",
  description: "Apps and tools I use on Mac, iOS, Safari, and the web.",
  ...pageUrls("/tools"),
};

export const booksMetadata: Metadata = {
  title: "Books",
  description: "Books I’ve read — a stroll through my bookshelf.",
  ...pageUrls("/books"),
};

export const photosMetadata: Metadata = {
  title: "Photos",
  description: "Photographs from trips.",
  ...pageUrls("/photos"),
};

export const bookmarksMetadata: Metadata = {
  title: "Bookmarks",
  description: "Discoveries from the web — saved bookmarks worth sharing.",
  ...pageUrls("/bookmarks"),
};

export const newsletterMetadata: Metadata = {
  title: "Newsletter",
  description:
    "Newsletter archive and subscribe — helpful tools and articles from my desk to yours.",
  ...pageUrls("/newsletter"),
};

export const pizzaMetadata: Metadata = {
  title: "Pizza Dough Calculator",
  description:
    "Scale Neapolitan pizza dough recipes, see baker’s percentages, and plan mix, ferment, and proof times from your bake time.",
  ...pageUrls("/pizza"),
};

export const breadMetadata: Metadata = {
  title: "Bread Dough Calculator",
  description:
    "Scale Saturday and Overnight white bread recipes, see baker’s percentages, and plan autolyse, ferment, and proof times from your bake time.",
  ...pageUrls("/bread"),
};

export const fuseBoxMetadata: Metadata = {
  title: "Fuse Box Labeler",
  description:
    "Design and print exact-size labels for the switches in your fuse box: number labels and description strips, colour-coded per RCD.",
  ...pageUrls("/fuse-box"),
};
