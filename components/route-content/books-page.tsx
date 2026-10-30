"use client";

import { HStack, Icon, SimpleGrid, Tabs, Text, VStack } from "@chakra-ui/react";
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

export default function BooksPage({ books }: BooksPageProps) {
  const tabBg = { _light: "neutral.300", _dark: "neutralD.300" };
  const tabColor = { _light: "neutral.1100", _dark: "neutralD.1000" };

  const allBooks = books.filter((book) => book.read === true).sort(byDateReadDescending);
  const favorites = books.filter((book) => book.favorite === true).sort(byDateReadDescending);

  return (
    <VStack gap={8}>
      <Hero title="Books" subtitle="Take a stroll through my bookshelf" />
      <Section>
        <Tabs.Root
          defaultValue="all"
          variant="subtle"
          colorPalette="blue"
          w="100%"
          lazyMount
          unmountOnExit
        >
          <Tabs.List display="flex" flexWrap="wrap" justifyContent="center" w="100%">
            <Tabs.Trigger
              value="all"
              bg={tabBg}
              color={tabColor}
              _selected={{ color: "blue.800", bg: "blue.100" }}
              mr={2}
            >
              <HStack gap={1}>
                <Icon asChild>
                  <BookOpenIcon />
                </Icon>
                <Text>All</Text>
              </HStack>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="favorites"
              bg={tabBg}
              color={tabColor}
              _selected={{ color: "red.800", bg: "red.100" }}
            >
              <HStack gap={1}>
                <Icon asChild>
                  <HeartIcon />
                </Icon>
                <Text>Favorites</Text>
              </HStack>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="all" px={0}>
            <BookGrid books={allBooks} empty={uiCopy.booksAll} />
          </Tabs.Content>
          <Tabs.Content value="favorites" px={0}>
            <BookGrid books={favorites} empty={uiCopy.booksFavorites} />
          </Tabs.Content>
        </Tabs.Root>
      </Section>
    </VStack>
  );
}
