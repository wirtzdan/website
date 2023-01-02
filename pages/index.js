import React from "react";
import fs from "fs";
import Head from "next/head";
import {
  Button,
  Box,
  VStack,
  Text,
  Heading,
  SimpleGrid,
  Stack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import PageTransition from "../components/page-transitions";
import Section from "@/components/section";
import sorter from "sort-isostring";
import { getAllPosts } from "../lib/airtable";
import Link from "@/components/link";
import SubscribeCard from "@/components/subscribe-card";
import BlogListItem from "@/components/blog-list-item";
import generateRssIcon from "@/lib/rss";
import Subscribe from "@/components/subscribe";

const Home = ({ posts }) => (
  <Box>
    <PageTransition>
      <VStack spacing={12}>
        <Section>
          <VStack spacing={4} align="start" fontSize="2xl">
            <VStack
              w="100%"
              // spacing={8}
              rounded="lg"
              borderWidth="1px"
              bg={useColorModeValue("white", "neutralD.100")}
              borderColor={useColorModeValue("neutral.400", "neutralD.400")}
              p={8}
              align="start"
              // height={48}
            >
              <Heading size="lg">Hey, I'm Daniel. </Heading>
              <Text fontSize={["lg", "2xl"]}>
                I’m a designer, facilitator, creator and the co-founder of{" "}
                <Link variant="text" href="https://www.facilitator.school">
                  Facilitator School
                </Link>
                . This is my corner of the internet.
              </Text>
            </VStack>
          </VStack>
        </Section>
        <Section>
          <VStack align="start" spacing={8}>
            <Heading size="lg">Recent Posts</Heading>
            <SimpleGrid columns={1} spacing={4} mt={8} w="100%">
              {posts
                .slice(0, 3)
                .filter((p) => p.fields.status === "Published")
                .sort((x, y) =>
                  sorter(y.fields.publishDate, x.fields.publishDate)
                )
                .map((post) => {
                  return <BlogListItem key={post.id} {...post.fields} />;
                })}
            </SimpleGrid>
          </VStack>
        </Section>
        <Section>
          <SubscribeCard title="Subscribe to my newsletter" description="" />
        </Section>
      </VStack>
    </PageTransition>
  </Box>
);

export async function getStaticProps() {
  const posts = await getAllPosts();

  const rss = await generateRssIcon(posts);

  fs.writeFileSync("./public/rss.xml", rss);

  return {
    props: {
      posts,
    },
    revalidate: 10,
  };
}

export default Home;
