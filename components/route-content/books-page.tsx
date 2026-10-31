"use client";

import { useState, type ReactNode } from "react";
import { Box, HStack, SegmentGroup, SimpleGrid, VStack } from "@chakra-ui/react";
import { BookOpenIcon, HeartIcon } from "@heroicons/react/24/solid";
import sorter from "sort-isostring";

import BookCard from "@/components/book-card";
import EmptyState from "@/components/empty-state";
import Hero from "@/components/hero";
import Section from "@/components/section";
import { uiCopy } from "@/lib/ui-copy";
import type { BookSummary } from "@/types/content";

type BooksPageProps = {
  books: BookSummary[];
};

type BookFilter = "all" | "favorites";

const segmentIcon = {
  width: 16,
  height: 16,
  display: "block",
  flexShrink: 0,
} as const;

function BookGrid({
  books,
  empty,
}: {
  books: BookSummary[];
  empty: { title: string; description: string };
}) {
  if (books.length === 0) {
    return <EmptyState mt={8} minH="36" title={empty.title} description={empty.description} />;
  }

  return (
    <SimpleGrid columns={[1, 2]} gap={4} rowGap={8} mt={8}>
      {books.map((book) => (
        <BookCard
          key={book.id}
          title={book.title}
          author={book.author}
          rating={book.rating ?? undefined}
          isFavorite={book.favorite}
          coverUrl={book.coverUrl ?? undefined}
          dateRead={book.dateRead ?? undefined}
        />
      ))}
    </SimpleGrid>
  );
}

function byDateReadDescending(left: BookSummary, right: BookSummary) {
  if (!left.dateRead && !right.dateRead) {
    return 0;
  }
  if (!left.dateRead) {
    return 1;
  }
  if (!right.dateRead) {
    return -1;
  }
  return sorter(right.dateRead, left.dateRead);
}

function FilterIcon({ children }: { children: ReactNode }) {
  return (
    <Box boxSize="16px" flexShrink={0} display="flex" alignItems="center" justifyContent="center">
      {children}
    </Box>
  );
}

export default function BooksPage({ books }: BooksPageProps) {
  const [filter, setFilter] = useState<BookFilter>("all");

  const allBooks = books.filter((book) => book.read === true).sort(byDateReadDescending);
  const favorites = books.filter((book) => book.favorite === true).sort(byDateReadDescending);
  const visible = filter === "favorites" ? favorites : allBooks;
  const empty = filter === "favorites" ? uiCopy.booksFavorites : uiCopy.booksAll;

  return (
    <VStack gap={8}>
      <style>{`
        @keyframes book-cover-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .book-cover {
          animation: book-cover-fade 240ms ease both;
        }
        @media (prefers-reduced-motion: reduce) {
          .book-cover { animation: none; }
        }
      `}</style>
      <Hero title="Books" subtitle="Take a stroll through my bookshelf" />
      <Section>
        <VStack gap={0}>
          <SegmentGroup.Root
            aria-label="Filter books"
            name="book-filter"
            size="md"
            value={filter}
            onValueChange={(details) => {
              if (details.value === "all" || details.value === "favorites") {
                setFilter(details.value);
              }
            }}
            bg={{ _light: "neutral.300", _dark: "neutralD.400" }}
            p="1"
            borderRadius="lg"
            boxShadow="none"
          >
            <SegmentGroup.Item
              value="all"
              minW="9rem"
              justifyContent="center"
              borderRadius="md"
              bg="transparent"
              color={{ _light: "neutral.1100", _dark: "neutralD.1100" }}
              _checked={{
                bg: { _light: "neutral.1100!", _dark: "neutralD.1100!" },
                color: { _light: "white", _dark: "neutralD.50" },
              }}
              _before={{ display: "none" }}
            >
              <HStack gap="1.5">
                <FilterIcon>
                  <BookOpenIcon width={16} height={16} aria-hidden style={segmentIcon} />
                </FilterIcon>
                <SegmentGroup.ItemText>All</SegmentGroup.ItemText>
              </HStack>
              <SegmentGroup.ItemHiddenInput />
            </SegmentGroup.Item>
            <SegmentGroup.Item
              value="favorites"
              minW="9rem"
              justifyContent="center"
              borderRadius="md"
              bg="transparent"
              color={{ _light: "neutral.1100", _dark: "neutralD.1100" }}
              _checked={{
                bg: { _light: "neutral.1100!", _dark: "neutralD.1100!" },
                color: { _light: "white", _dark: "neutralD.50" },
              }}
              _before={{ display: "none" }}
            >
              <HStack gap="1.5">
                <FilterIcon>
                  <HeartIcon width={16} height={16} aria-hidden style={segmentIcon} />
                </FilterIcon>
                <SegmentGroup.ItemText>Favorites</SegmentGroup.ItemText>
              </HStack>
              <SegmentGroup.ItemHiddenInput />
            </SegmentGroup.Item>
          </SegmentGroup.Root>
          <BookGrid books={visible} empty={empty} />
        </VStack>
      </Section>
    </VStack>
  );
}
