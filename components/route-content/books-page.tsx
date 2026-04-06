"use client";

import { HStack, Icon, SimpleGrid, Tabs, Text, VStack } from "@chakra-ui/react";
import { RiBookOpenFill, RiHeartFill } from "@remixicon/react";
import sorter from "sort-isostring";

import BookCard from "@/components/book-card";
import Hero from "@/components/hero";
import Section from "@/components/section";
import type { AirtableRecord, BookFields } from "@/lib/airtable";

type BooksPageProps = {
  books: AirtableRecord<BookFields>[];
};

export default function BooksPage({ books }: BooksPageProps) {
  return (
    <VStack gap={8}>
      <Hero title="Books" subtitle="Take a stroll through my bookshelf" />
      <Section>
        <Tabs.Root
          defaultValue="all"
          variant="subtle"
          colorPalette="blue"
          justifyContent="center"
          w="100%"
        >
          <Tabs.List>
            <Tabs.Trigger value="all" mr={2}>
              <HStack gap={1}>
                <Icon asChild>
                  <RiBookOpenFill />
                </Icon>
                <Text>All</Text>
              </HStack>
            </Tabs.Trigger>
            <Tabs.Trigger value="favorites">
              <HStack gap={1}>
                <Icon asChild>
                  <RiHeartFill />
                </Icon>
                <Text>Favorites</Text>
              </HStack>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="all" px={0}>
            <SimpleGrid columns={[1, 2]} gap={8} columnGap={4} mt={8}>
              {books
                .filter((book) => book.fields.Read === true)
                .sort((left, right) =>
                  sorter(right.fields["Date Read"] ?? "", left.fields["Date Read"] ?? ""),
                )
                .map((book) => (
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
            <SimpleGrid columns={[1, 2]} gap={8} columnGap={4} mt={8}>
              {books
                .filter((book) => book.fields.Favorite === true)
                .sort((left, right) =>
                  sorter(right.fields["Date Read"] ?? "", left.fields["Date Read"] ?? ""),
                )
                .map((book) => (
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
