import React from "react";
import Head from "next/head";
import {
  chakra,
  Icon,
  Button,
  VStack,
  HStack,
  Text,
  IconButton,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Box,
  SimpleGrid,
  useTab,
  useStyles,
} from "@chakra-ui/react";
import Container from "../components/container";
import PageTransition from "../components/page-transitions";
import { getBooks } from "@/lib/airtable";
import Section from "@/components/section";
import Image from "next/image";
import BookCard from "@/components/book-card";
import { usePagination } from "react-use-pagination";
import BookSuggestion from "@/components/book-suggestion";
import { BookOpen, Heart } from "heroicons-react";

const Books = ({ books }) => {
  console.log("🚀 ~ file: books.js ~ line 39 ~ Books ~ books", books);

  const StyledTab = chakra("button", { themeKey: "Tabs.Tab" });

  const CustomTab = React.forwardRef((props, ref) => {
    // 2. Reuse the `useTab` hook
    const tabProps = useTab(props);
    const isSelected = !!tabProps["aria-selected"];

    // 3. Hook into the Tabs `size`, `variant`, props
    const styles = useStyles();

    return (
      <StyledTab __css={styles.tab} {...tabProps}>
        {tabProps.children}
      </StyledTab>
    );
  });

  return (
    <PageTransition>
      <VStack spacing={8} py={16}>
        <Section>
          <VStack>
            <Heading as="h1">Books</Heading>
            <Text
              fontSize="2xl"
              color={useColorModeValue("gray.500", "gray.200")}
              maxW="lg"
              textAlign="center"
            >
              Welcome to my book corner. At the moment I'm reading Fish don't
              exist by Lulu Miller.
            </Text>
            <BookSuggestion />
          </VStack>
        </Section>
        <Section>
          <Tabs variant="soft-rounded" colorScheme="blue" align="center">
            <TabList>
              <Tab
                bg={useColorModeValue("gray.100", "gray.800")}
                color={useColorModeValue("gray.500", "gray.500")}
                _selected={{
                  color: "blue.800",
                  bg: "blue.100",
                }}
                mr={2}
              >
                <HStack spacing={1}>
                  <Icon as={BookOpen} />
                  <Text>All</Text>
                </HStack>
              </Tab>
              <Tab
                bg={useColorModeValue("gray.100", "gray.800")}
                color={useColorModeValue("gray.600", "gray.500")}
                _selected={{
                  color: "red.800",
                  bg: "red.100",
                }}
              >
                <HStack spacing={1}>
                  <Icon as={Heart} />
                  <Text>Favorites</Text>
                </HStack>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={2} spacing={4}>
                  {books
                    .filter((b) => b.fields.Read === true)
                    .map((book) => (
                      <BookCard
                        key={book.id}
                        title={book.fields.Title}
                        author={book.fields.Author}
                        rating={book.fields.Rating}
                        isFavorite={book.fields.Favorite}
                      />
                    ))}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={2} spacing={4}>
                  {books
                    .filter((b) => b.fields.Favorite == true)
                    .map((book) => (
                      <BookCard
                        key={book.id}
                        title={book.fields.Title}
                        author={book.fields.Author}
                        rating={book.fields.Rating}
                        isFavorite={book.fields.Favorite}
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
  const books = await getBooks();
  console.log("🚀 ~ file: books.js ~ line 145 ~ getStaticProps ~ books", books);

  return {
    props: {
      books,
    },
  };
}

export default Books;
