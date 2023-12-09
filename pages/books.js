import React from "react";
import {
  chakra,
  Icon,
  VStack,
  HStack,
  Text,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  SimpleGrid,
  useTab,
  useStyles,
  Link,
} from "@chakra-ui/react";
import PageTransition from "../components/page-transitions";
import { getTable } from "@/lib/airtable";
import Section from "@/components/section";
import BookCard from "@/components/book-card";
import BookSuggestion from "@/components/book-suggestion";
import { BookOpenIcon, HeartIcon } from "@heroicons/react/24/solid";
import sorter from "sort-isostring";
import Hero from "@/components/hero";

const Books = ({ books }) => {
  const StyledTab = chakra("button", { themeKey: "Tabs.Tab" });

  return (
    <PageTransition>
      <VStack spacing={8}>
        <Hero
          title="Books"
          subtitle="Take a stroll through my bookshelf"
          mb={8}
        ></Hero>
        <Section>
          <Tabs
            variant="soft-rounded"
            colorScheme="blue"
            align="center"
            w="100%"
          >
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
                    .filter((b) => b.fields.Read === true)
                    .sort((x, y) =>
                      sorter(y.fields["Date Read"], x.fields["Date Read"])
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
                    .filter((b) => b.fields.Favorite == true)
                    .sort((x, y) =>
                      sorter(y.fields["Date Read"], x.fields["Date Read"])
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
    </PageTransition>
  );
};

export async function getStaticProps() {
  const books = await getTable("Books");

  return {
    props: {
      books,
    },
    revalidate: 10,
  };
}

export default Books;
