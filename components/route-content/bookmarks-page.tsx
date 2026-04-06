"use client";

import { SimpleGrid, VStack } from "@chakra-ui/react";

import BookmarkCard from "@/components/bookmark-card";
import Hero from "@/components/hero";
import Section from "@/components/section";
import type { BookmarkResponse } from "@/types/content";

type BookmarksPageProps = {
  bookmarks: BookmarkResponse;
};

export default function BookmarksPage({ bookmarks }: BookmarksPageProps) {
  return (
    <VStack gap={8}>
      <Hero title="Bookmarks" subtitle="Discoveries from the World Wide Web" />
      <Section>
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
      </Section>
    </VStack>
  );
}
