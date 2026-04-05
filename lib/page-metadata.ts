import type { Metadata } from "next";

const base = "https://danielwirtz.com";

export const homeMetadata: Metadata = {
  title: "Home",
  description:
    "Daniel Wirtz — designer and growth. Latest posts, books, bookmarks, and articles from the Netherlands.",
  alternates: { canonical: base },
};

export const aboutMetadata: Metadata = {
  title: "About",
  description:
    "About Daniel Wirtz: experience, what I like (and dislike), and how this site is built.",
  alternates: { canonical: `${base}/about` },
};

export const blogIndexMetadata: Metadata = {
  title: "Blog",
  description: "Helpful tools, thoughtful articles and other findings from the web.",
  alternates: { canonical: `${base}/blog` },
};

export const toolsMetadata: Metadata = {
  title: "Tools",
  description: "Apps and tools I use on Mac, iOS, Safari, and the web.",
  alternates: { canonical: `${base}/tools` },
};

export const booksMetadata: Metadata = {
  title: "Books",
  description: "Books I’ve read — a stroll through my bookshelf.",
  alternates: { canonical: `${base}/books` },
};

export const bookmarksMetadata: Metadata = {
  title: "Bookmarks",
  description: "Discoveries from the web — saved bookmarks worth sharing.",
  alternates: { canonical: `${base}/bookmarks` },
};

export const newsletterMetadata: Metadata = {
  title: "Newsletter",
  description:
    "Newsletter archive and subscribe — helpful tools and articles from my desk to yours.",
  alternates: { canonical: `${base}/newsletter` },
};
