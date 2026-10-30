/**
 * Visitor-facing empty and error copy.
 * Edit the strings in this file.
 */

export const uiCopy = {
  booksAll: {
    title: "No books here yet.",
    description: "I’m probably still reading one.",
  },
  booksFavorites: {
    title: "No favorites yet.",
    description: "I haven’t marked any.",
  },
  bookmarks: {
    title: "No bookmarks here yet.",
    description: "I’m still collecting things worth saving.",
  },
  newsletterArchive: {
    title: "No past issues yet.",
    description: "The first one hasn’t gone out.",
  },
  homeLatest: {
    title: "Nothing new on the blog yet.",
    description: "Check back soon.",
  },
  blogIndex: {
    title: "Nothing new on the blog yet.",
    description: "Check back soon.",
  },
  error: {
    title: "This page didn’t load",
    description: "I hit a snag while putting this page together.",
    retry: "Try again",
    home: "Return home",
  },
} as const;

export const toolEmptyCopy = {
  Mac: {
    title: "No Mac apps here yet.",
    description: "I haven’t listed any.",
  },
  iOS: {
    title: "No iOS apps here yet.",
    description: "I haven’t listed any.",
  },
  Safari: {
    title: "No Safari extensions here yet.",
    description: "I haven’t listed any.",
  },
  Web: {
    title: "No web tools here yet.",
    description: "I haven’t listed any.",
  },
} as const;
