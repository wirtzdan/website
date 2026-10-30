import { notFound } from "next/navigation";

import BookmarksPage from "@/components/route-content/bookmarks-page";
import Layout from "@/layouts/layout";
import { CONTENT_CACHE_TAGS, CONTENT_REVALIDATE_SECONDS } from "@/lib/content-cache";
import { bookmarksMetadata } from "@/lib/page-metadata";
import type { BookmarkResponse } from "@/types/content";

export const metadata = bookmarksMetadata;

export const revalidate = 3600;

async function getBookmarks(): Promise<BookmarkResponse | null> {
  const url =
    'https://api.raindrop.io/rest/v1/raindrops/0?search=[{"key":"important","val":"true"}]&sort="-created"&perpage=30';

  const response = await fetch(url, {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${process.env.RAINDROP_ACCESS_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
    next: {
      revalidate: CONTENT_REVALIDATE_SECONDS,
      tags: [CONTENT_CACHE_TAGS.bookmarks, CONTENT_CACHE_TAGS.all],
    },
  });

  if (!response.ok) {
    throw new Error(`Raindrop responded with ${response.status}`);
  }

  const bookmarks = (await response.json()) as BookmarkResponse | null;
  return bookmarks;
}

export default async function Page() {
  const raw = await getBookmarks();
  if (!raw) {
    notFound();
  }

  const bookmarks: BookmarkResponse = {
    items: [...(raw.items ?? [])].sort(
      (left, right) => new Date(right.created).getTime() - new Date(left.created).getTime(),
    ),
  };

  return (
    <Layout>
      <BookmarksPage bookmarks={bookmarks} />
    </Layout>
  );
}
