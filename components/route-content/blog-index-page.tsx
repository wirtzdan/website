"use client";

import { SimpleGrid, VStack } from "@chakra-ui/react";

import BlogListItem from "@/components/blog-list-item";
import Hero from "@/components/hero";
import Section from "@/components/section";
import SubscribeCard from "@/components/subscribe-card";
import type { BlogPostSummary, PaginatedResults } from "@/types/content";

type BlogIndexPageProps = {
  posts: PaginatedResults<BlogPostSummary>;
};

export default function BlogIndexPage({ posts }: BlogIndexPageProps) {
  return (
    <Section>
      <VStack gap={4}>
        <Hero
          title="Blog"
          subtitle="Helpful tools, thoughtful articles and other findings from the web."
        />

        <SubscribeCard image={false} title="" description="" card={false} center />

        {!posts.results.length ? "No posts found." : null}

        <SimpleGrid columns={1} gap={4} pt={8} w="100%">
          {posts.results
            .filter((post) => post.isPublished)
            .sort(
              (left, right) =>
                new Date(right.publishDate).getTime() - new Date(left.publishDate).getTime(),
            )
            .map((post) => (
              <BlogListItem key={post.id} {...post} />
            ))}
        </SimpleGrid>
      </VStack>
    </Section>
  );
}
