import React from "react";
import {
  VStack,
  Text,
  Heading,
  useColorModeValue,
  SimpleGrid,
  Grid,
} from "@chakra-ui/react";
import PageTransition from "../components/page-transitions";
import Section from "@/components/section";
import sorter from "sort-isostring";

import BookmarkCard from "../components/bookmark-card";

const Bookmarks = ({ bookmarks }) => {
  return (
    <PageTransition>
      <VStack spacing={8} py={16} pb={{ base: 24, md: 16 }}>
        <Section>
          <VStack>
            <Heading as="h1">Bookmarks</Heading>
            <Text
              fontSize={["xl", "2xl"]}
              color={useColorModeValue("gray.500", "gray.200")}
              maxW="lg"
              textAlign="center"
            >
              Discoveries from the World Wide Web.
            </Text>
          </VStack>
        </Section>
        <Section>
          <SimpleGrid columns={[2, 3]} spacing={4}>
            {bookmarks.items
              .sort((x, y) => sorter(y.created, x.created))
              .map((bookmark) => (
                <BookmarkCard
                  key={bookmark.title}
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
    </PageTransition>
  );
};

export async function getStaticProps() {
  const url = `https://api.raindrop.io/rest/v1/raindrops/0?search=[{"key":"important"}]
`;

  const res = await fetch(url, {
    method: "get",
    headers: new Headers({
      Authorization: `Bearer ${process.env.RAINDROP_ACCESS_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  });

  const bookmarks = await res.json();
  console.log(
    "🚀 ~ file: bookmarks.js ~ line 88 ~ getStaticProps ~ bookmarks",
    bookmarks
  );

  if (!bookmarks) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      bookmarks,
    },
    revalidate: 60,
  };
}

export default Bookmarks;
