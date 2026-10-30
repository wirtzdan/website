"use client";

import { SimpleGrid, VStack } from "@chakra-ui/react";

import BlogListItem from "@/components/blog-list-item";
import EmptyState from "@/components/empty-state";
import Hero from "@/components/hero";
import Section from "@/components/section";
import SubscribeCard from "@/components/subscribe-card";
import { uiCopy } from "@/lib/ui-copy";
import type { BlogPostSummary, PaginatedResults } from "@/types/content";

type BlogIndexPageProps = {
  posts: PaginatedResults<BlogPostSummary>;
};

export default function BlogIndexPage({ posts }: BlogIndexPageProps) {
  const published = posts.results
    .filter((post) => post.isPublished)
    .sort(
      (left, right) => new Date(right.publishDate).getTime() - new Date(left.publishDate).getTime(),
    );

  return (
    <Section>
      <VStack gap={4}>
        <Hero
          title="Blog"
          subtitle="Helpful tools, thoughtful articles and other findings from the web."
        />

        <SubscribeCard image={false} title="" description="" card={false} center />

        {published.length === 0 ? (
          <EmptyState
            mt={8}
            minH="28"
            title={uiCopy.blogIndex.title}
            description={uiCopy.blogIndex.description}
          />
        ) : (
          <SimpleGrid columns={1} gap={4} pt={8} w="100%">
            {published.map((post) => (
              <BlogListItem key={post.id} {...post} />
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Section>
  );
}
