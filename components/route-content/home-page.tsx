"use client";

import { Box, Button, Heading, HStack, Icon, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

import BlogListItem from "@/components/blog-list-item";
import Link from "@/components/link";
import Section from "@/components/section";
import SubscribeCard from "@/components/subscribe-card";
import type { BlogPostSummary, PaginatedResults } from "@/types/content";

type HomePageProps = {
  posts: PaginatedResults<BlogPostSummary>;
};

const RecordingDot = () => (
  <Box position="relative" display="inline-flex" alignItems="center" mt="1px">
    <motion.div
      style={{
        width: 6,
        height: 6,
        backgroundColor: "red",
        borderRadius: "50%",
        display: "inline-block",
        position: "relative",
        zIndex: 2,
      }}
    />
    <motion.div
      style={{
        width: 6,
        height: 6,
        backgroundColor: "red",
        borderRadius: "50%",
        position: "absolute",
        left: 0,
      }}
      animate={{
        scale: 2.5,
        opacity: 0,
      }}
      initial={{
        scale: 1,
        opacity: 0.3,
      }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  </Box>
);

export default function HomePage({ posts }: HomePageProps) {
  const latestPosts = posts.results
    .filter((post) => post.isPublished)
    .sort(
      (left, right) => new Date(right.publishDate).getTime() - new Date(left.publishDate).getTime(),
    )
    .slice(0, 3);

  return (
    <VStack spacing={16}>
      <Section>
        <VStack spacing={4} align="start">
          <VStack spacing={6} align="start">
            <HStack justify="space-between" w="100%" align="center" fontSize="2xl">
              <Heading size="lg">Hey there. 👋</Heading>
              <Link href="/about" unstyled>
                <Button
                  variant="ghost"
                  rightIcon={<Icon as={ArrowUpRightIcon} />}
                  size={["sm", "md"]}
                >
                  Read more
                </Button>
              </Link>
            </HStack>
            <Text fontSize={["lg", "2xl"]}>
              I&apos;m Daniel. I work in the Growth team at{" "}
              <Link href="https://www.givingwhatwecan.org/" isExternal>
                Giving What We Can
              </Link>
              , and live in the Netherlands. I like to read <Link href="/books">books</Link>, save{" "}
              <Link href="/bookmarks">bookmarks</Link> and to occasionally write{" "}
              <Link href="/blog">articles</Link>.
            </Text>
            {false ? <RecordingDot /> : null}
          </VStack>
        </VStack>
      </Section>
      <Section>
        <VStack align="start" spacing={8}>
          <HStack justify="space-between" w="100%" align="center">
            <Heading size="lg">Latest Posts</Heading>
            <Link href="/blog" unstyled>
              <Button
                size={["sm", "md"]}
                variant="ghost"
                rightIcon={<Icon as={ArrowUpRightIcon} />}
              >
                View all
              </Button>
            </Link>
          </HStack>
          <SimpleGrid columns={1} spacing={4} w="100%">
            {latestPosts.map((post) => (
              <BlogListItem key={post.id} {...post} />
            ))}
          </SimpleGrid>
        </VStack>
      </Section>
      <Section>
        <VStack align="start" spacing={8}>
          <Heading size="lg">Subscribe</Heading>
          <VStack spacing={4}>
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
