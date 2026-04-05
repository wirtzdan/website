"use client";

import {
  HStack,
  Icon,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { BookOpenIcon, HeartIcon } from "@heroicons/react/24/solid";
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
    <VStack spacing={8}>
      <Hero title="Books" subtitle="Take a stroll through my bookshelf" />
      <Section>
        <Tabs variant="soft-rounded" colorScheme="blue" align="center" w="100%">
          <TabList>
            <Tab
              bg={useColorModeValue("neutral.300", "neutralD.300")}
              color={useColorModeValue("neutral.900", "neutralD.900")}
              _selected={{
                color: "blue.800",
                bg: "blue.100",
              }}
              mr={2}
            >
              <HStack spacing={1}>
                <Icon as={BookOpenIcon} />
                <Text>All</Text>
              </HStack>
            </Tab>
            <Tab
              bg={useColorModeValue("neutral.300", "neutralD.300")}
              color={useColorModeValue("neutral.900", "neutralD.900")}
              _selected={{
                color: "red.800",
                bg: "red.100",
              }}
            >
              <HStack spacing={1}>
                <Icon as={HeartIcon} />
                <Text>Favorites</Text>
              </HStack>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <SimpleGrid columns={[1, 2]} spacingY={8} spacingX={4} mt={8}>
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
            </TabPanel>
            <TabPanel px={0}>
              <SimpleGrid columns={[1, 2]} spacingY={8} spacingX={4} mt={8}>
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
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Section>
    </VStack>
  );
}
