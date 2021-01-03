import React from "react";
import Head from "next/head";
import fs from "fs";
import {
  Button,
  VStack,
  HStack,
  Text,
  IconButton,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import Container from "../components/container";
import PageTransition from "../components/page-transitions";
import Section from "@/components/section";
import BlogCard from "@/components/blog-card";
import { getAllFilesFrontMatter } from "@/lib/mdx";
import sorter from "sort-isostring";
import NewsletterDrawer from "@/components/newsletter-drawer";
import generateRss from "@/lib/rss";

export default function Blog({ posts }) {
  const filteredBlogPosts = posts.sort(
    (a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
  );

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

          {!filteredBlogPosts.length && "No posts found."}
          <VStack w="100%" align="start" spacing={4}>
            {filteredBlogPosts
              .sort((x, y) => sorter(y.publishedAt, x.publishedAt))
              .map((frontMatter) => (
                <BlogCard key={frontMatter.title} {...frontMatter} />
              ))}
          </VStack>
        </VStack>
      </Section>
    </PageTransition>
  );
}

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter("blog");
  const rss = generateRss(posts);
  console.log("🚀 ~ file: blog.js ~ line 62 ~ getStaticProps ~ rss", rss);

  fs.writeFileSync("./public/rss.xml", rss);

  return { props: { posts } };
}
