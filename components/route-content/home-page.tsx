"use client";

import { Button, Heading, HStack, Icon, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { RiArrowRightUpLine } from "@remixicon/react";
import NextLink from "next/link";

import BlogListItem from "@/components/blog-list-item";
import EmptyState from "@/components/empty-state";
import Link from "@/components/link";
import Section from "@/components/section";
import SubscribeCard from "@/components/subscribe-card";
import { uiCopy } from "@/lib/ui-copy";
import type { BlogPostSummary, PaginatedResults } from "@/types/content";

type HomePageProps = {
  posts: PaginatedResults<BlogPostSummary>;
};

export default function HomePage({ posts }: HomePageProps) {
  const latestPosts = posts.results
    .filter((post) => post.isPublished)
    .sort(
      (left, right) => new Date(right.publishDate).getTime() - new Date(left.publishDate).getTime(),
    )
    .slice(0, 3);

  return (
    <VStack gap={16}>
      <Section>
        <VStack gap={4} align="start">
          <VStack gap={6} align="start">
            <HStack justify="space-between" w="100%" align="center" fontSize="2xl">
              <Heading as="h1" size="lg">
                Hey there. 👋
              </Heading>
              <Button variant="ghost" size={["sm", "md"]} asChild>
                <NextLink href="/about">
                  Read more
                  <Icon asChild>
                    <RiArrowRightUpLine />
                  </Icon>
                </NextLink>
              </Button>
            </HStack>
            <Text fontSize={["lg", "2xl"]}>
              I&apos;m Daniel. I&apos;m a Senior Design Engineer at{" "}
              <Link href="https://www.givingwhatwecan.org/" isExternal>
                Giving What We Can
              </Link>
              , and live in the Netherlands. I like to read <Link href="/books">books</Link>, save{" "}
              <Link href="/bookmarks">bookmarks</Link> and to occasionally write{" "}
              <Link href="/blog">articles</Link>.
            </Text>
          </VStack>
        </VStack>
      </Section>
      <Section>
        <VStack align="start" gap={8}>
          <HStack justify="space-between" w="100%" align="center">
            <Heading size="lg">Latest Posts</Heading>
            <Button size={["sm", "md"]} variant="ghost" asChild>
              <NextLink href="/blog">
                View all
                <Icon asChild>
                  <RiArrowRightUpLine />
                </Icon>
              </NextLink>
            </Button>
          </HStack>
          {latestPosts.length === 0 ? (
            <EmptyState
              minH="28"
              title={uiCopy.homeLatest.title}
              description={uiCopy.homeLatest.description}
            />
          ) : (
            <SimpleGrid columns={1} gap={4} w="100%">
              {latestPosts.map((post) => (
                <BlogListItem key={post.id} {...post} />
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Section>
      <Section>
        <VStack align="start" gap={8}>
          <Heading size="lg">Subscribe</Heading>
          <VStack gap={4}>
            <Text>
              If you want to stay up to date with my latest posts you can sign up to my newsletter.
              I promise I won&apos;t spam you. (To be honest, I&apos;m not the best at keeping up
              with a newsletter schedule...)
            </Text>
            <SubscribeCard card={false} title="" description="" />
          </VStack>
        </VStack>
      </Section>
    </VStack>
  );
}
