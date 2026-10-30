"use client";

import { SimpleGrid, VStack } from "@chakra-ui/react";

import BookmarkCard from "@/components/bookmark-card";
import EmptyState from "@/components/empty-state";
import Hero from "@/components/hero";
import Section from "@/components/section";
import { uiCopy } from "@/lib/ui-copy";
import type { BookmarkResponse } from "@/types/content";

type BookmarksPageProps = {
  bookmarks: BookmarkResponse;
};

export default function BookmarksPage({ bookmarks }: BookmarksPageProps) {
  return (
    <VStack gap={8}>
      <Hero title="Bookmarks" subtitle="Discoveries from the World Wide Web" />
      <Section>
        {bookmarks.items.length === 0 ? (
          <EmptyState
            minH="40"
            title={uiCopy.bookmarks.title}
            description={uiCopy.bookmarks.description}
          />
        ) : (
          <SimpleGrid columns={[2, 3]} gap={4}>
            {bookmarks.items.map((bookmark) => (
              <BookmarkCard
                key={`${bookmark.link}-${bookmark.created}`}
                title={bookmark.title}
                cover={bookmark.cover}
                created={bookmark.created}
                excerpt={bookmark.excerpt}
                type={bookmark.type}
                link={bookmark.link}
              />
            ))}
          </SimpleGrid>
        )}
      </Section>
    </VStack>
  );
}
