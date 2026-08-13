"use client";

import { HStack, Icon, SimpleGrid, Tabs, Text, VStack } from "@chakra-ui/react";
import { BookOpenIcon, HeartIcon } from "@heroicons/react/24/solid";
import sorter from "sort-isostring";

import BookCard from "@/components/book-card";
import Hero from "@/components/hero";
import Section from "@/components/section";
import { useColorModeValue } from "@/components/ui/color-mode";
import type { AirtableRecord, BookFields } from "@/lib/airtable";

type BooksPageProps = {
  books: AirtableRecord<BookFields>[];
};

export default function BooksPage({ books }: BooksPageProps) {
  const tabBg = useColorModeValue("neutral.300", "neutralD.300");
  const tabColor = useColorModeValue("neutral.900", "neutralD.900");

  const allBooks = books
    .filter((book) => book.fields.Read === true)
    .sort((left, right) => sorter(right.fields["Date Read"] ?? "", left.fields["Date Read"] ?? ""));
  const favorites = books
    .filter((book) => book.fields.Favorite === true)
    .sort((left, right) => sorter(right.fields["Date Read"] ?? "", left.fields["Date Read"] ?? ""));

  return (
    <VStack gap={8}>
      <Hero title="Books" subtitle="Take a stroll through my bookshelf" />
      <Section>
        <Tabs.Root defaultValue="all" variant="subtle" colorPalette="blue" w="100%">
          <Tabs.List justifyContent="center">
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
            <SimpleGrid columns={[1, 2]} gap={4} rowGap={8} mt={8}>
              {allBooks.map((book) => (
                <BookCard
                  key={book.id}
                  title={book.fields.Title}
                  author={book.fields.Author}
                  rating={book.fields.Rating}
                  isFavorite={book.fields.Favorite}
                  cover={book.fields.Cover}
                  dateRead={book.fields["Date Read"]}
                />
              ))}
            </SimpleGrid>
          </Tabs.Content>
          <Tabs.Content value="favorites" px={0}>
            <SimpleGrid columns={[1, 2]} gap={4} rowGap={8} mt={8}>
              {favorites.map((book) => (
                <BookCard
                  key={book.id}
                  title={book.fields.Title}
                  author={book.fields.Author}
                  rating={book.fields.Rating}
                  isFavorite={book.fields.Favorite}
                  cover={book.fields.Cover}
                  dateRead={book.fields["Date Read"]}
                />
              ))}
            </SimpleGrid>
          </Tabs.Content>
        </Tabs.Root>
      </Section>
    </VStack>
  );
}
