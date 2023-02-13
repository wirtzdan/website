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
import Hero from "@/components/hero";

const Home = ({ posts }) => (
  <Box>
    <PageTransition>
      <VStack spacing={12}>
        <Section>
          <VStack spacing={4} align="start" fontSize="2xl">
            <VStack
              // w="100%"
              spacing={4}
              // rounded="lg"
              // borderWidth="1px"
              // bg={useColorModeValue("white", "neutralD.100")}
              // borderColor={useColorModeValue("neutral.400", "neutralD.400")}
              // p={8}
              align="start"
              // // height={48}
            >
              <Heading size="lg" align="left">
                Hey, I'm Daniel.
              </Heading>
              <Text fontSize={["lg", "2xl"]}>
                I'm a designer and entrepreneur. Particularly interested in
                collaboration and visual design. I like to read{" "}
                <Link href="/books"> books</Link>, save{" "}
                <Link href="/bookmarks">bookmarks</Link> and to occasionally
                write <Link href="/blog">articles</Link>.
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
          <SubscribeCard title="Subscribe to my blog" description="" />
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
