import React from "react";
import fs from "fs";
import { VStack, Text, Heading, useColorModeValue } from "@chakra-ui/react";
import PageTransition from "../components/page-transitions";
import Section from "@/components/section";
import BlogCard from "@/components/blog-card";
import sorter from "sort-isostring";
import NewsletterDrawer from "@/components/newsletter-drawer";
import generateRss from "@/lib/rss";
import { getAllPosts } from "../lib/airtable";

export default function Blog({ posts }) {
  return (
    <PageTransition>
      <Section>
        <VStack spacing={8}>
          <VStack>
            <Heading as="h1">Blog</Heading>
            <Text
              fontSize="2xl"
              color={useColorModeValue("gray.500", "gray.200")}
              maxW="lg"
              textAlign="center"
            >
              Welcome to my blog. Here I share some of my thinking, insights and
              views on life.
            </Text>
            <NewsletterDrawer placement="blog" />
          </VStack>

          {!posts.length && "No posts found."}
          <VStack w="100%" align="start" spacing={4}>
            {posts
              .filter((p) => p.fields.status === "Published")
              .sort((x, y) =>
                sorter(y.fields.publishDate, x.fields.publishDate)
              )
              .map((post) => {
                return <BlogCard key={post.id} {...post.fields} />;
              })}
          </VStack>
        </VStack>
      </Section>
    </PageTransition>
  );
}

export async function getStaticProps() {
  const posts = await getAllPosts();

  const rss = await generateRss(posts);

  fs.writeFileSync("./public/rss.xml", rss);

  return {
    props: {
      posts,
    },
    revalidate: 10,
  };
}
