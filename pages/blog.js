import React from "react";
import fs from "fs";
import {
  VStack,
  Text,
  Heading,
  useColorModeValue,
  SimpleGrid,
  StackDivider,
} from "@chakra-ui/react";
import PageTransition from "../components/page-transitions";
import Section from "@/components/section";
import BlogCard from "@/components/blog-card";
import sorter from "sort-isostring";
import NewsletterDrawer from "@/components/newsletter-drawer";
import generateRss from "@/lib/rss";
import { getAllPosts } from "../lib/airtable";
import Hero from "@/components/hero";

export default function Blog({ posts }) {
  return (
    <PageTransition>
      <Section>
        <VStack spacing={8}>
          <Hero title="Blog" />
          {!posts.length && "No posts found."}

          <SimpleGrid columns={[1, 2]} spacing={4}>
            {posts
              .filter((p) => p.fields.status === "Published")
              .sort((x, y) =>
                sorter(y.fields.publishDate, x.fields.publishDate)
              )
              .map((post) => {
                return <BlogCard key={post.id} {...post.fields} />;
              })}
          </SimpleGrid>

          {/* <VStack
            w="100%"
            align="start"
            spacing={6}
            divider={
              <StackDivider
                borderColor={useColorModeValue("neutral.400", "neutralD.400")}
              />
            }
          >
            {posts
              .filter((p) => p.fields.status === "Published")
              .sort((x, y) =>
                sorter(y.fields.publishDate, x.fields.publishDate)
              )
              .map((post) => {
                return <BlogCard key={post.id} {...post.fields} />;
              })}
          </VStack> */}
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
