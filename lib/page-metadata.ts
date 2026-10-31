import type { Metadata } from "next";

import { SITE_NAME, SITE_TAGLINE, siteMetadata } from "@/lib/site-metadata";
import { absoluteUrl } from "@/lib/site-url";

// Next.js merges metadata shallowly, so a page that sets `openGraph` or
// `twitter` replaces the root object. Spread the site defaults back in and
// override only what is page-specific.
export function buildPageMetadata(input: {
  title: string;
  description: string;
  path: string;
  /** Use the title as-is instead of the "%s – Daniel Wirtz" template. */
  absoluteTitle?: boolean;
}): Metadata {
  const { title, description, path, absoluteTitle = false } = input;
  const url = absoluteUrl(path);
  const socialTitle = absoluteTitle ? title : `${title} – ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: { ...siteMetadata.openGraph, url, title: socialTitle, description },
    twitter: { ...siteMetadata.twitter, title: socialTitle, description },
  };
}

export const homeMetadata = buildPageMetadata({
  title: `${SITE_NAME} – ${SITE_TAGLINE}`,
  absoluteTitle: true,
  description:
    "Daniel Wirtz — Senior Design Engineer at Giving What We Can. Latest posts, books, bookmarks, and articles from the Netherlands.",
  path: "/",
});

export const aboutMetadata = buildPageMetadata({
  title: "About",
  description:
    "About Daniel Wirtz, Senior Design Engineer at Giving What We Can: experience, what I like (and dislike), and how this site is built.",
  path: "/about",
});

export const blogIndexMetadata = buildPageMetadata({
  title: "Blog",
  description: "Helpful tools, thoughtful articles and other findings from the web.",
  path: "/blog",
});

export const toolsMetadata = buildPageMetadata({
  title: "Tools",
  description: "Apps and tools I use on Mac, iOS, Safari, and the web.",
  path: "/tools",
});

export const booksMetadata = buildPageMetadata({
  title: "Books",
  description: "Books I’ve read — a stroll through my bookshelf.",
  path: "/books",
});

export const photosMetadata = buildPageMetadata({
  title: "Photos",
  description: "Photographs from trips.",
  path: "/photos",
});

export const bookmarksMetadata = buildPageMetadata({
  title: "Bookmarks",
  description: "Discoveries from the web — saved bookmarks worth sharing.",
  path: "/bookmarks",
});

export const newsletterMetadata = buildPageMetadata({
  title: "Newsletter",
  description:
    "Newsletter archive and subscribe — helpful tools and articles from my desk to yours.",
  path: "/newsletter",
});

export const pizzaMetadata = buildPageMetadata({
  title: "Pizza Dough Calculator",
  description:
    "Scale Neapolitan pizza dough recipes, see baker’s percentages, and plan mix, ferment, and proof times from your bake time.",
  path: "/pizza",
});

export const breadMetadata = buildPageMetadata({
  title: "Bread Dough Calculator",
  description:
    "Scale Saturday and Overnight white bread recipes, see baker’s percentages, and plan autolyse, ferment, and proof times from your bake time.",
  path: "/bread",
});

export const fuseBoxMetadata = buildPageMetadata({
  title: "Fuse Box Labeler",
  description:
    "Design and print exact-size labels for the switches in your fuse box: number labels and description strips, colour-coded per RCD.",
  path: "/fuse-box",
});
