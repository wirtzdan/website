"use client";

import Image from "next/image";
import ReactPlayer from "react-player/youtube";
import { AspectRatio, Box, Heading, Icon, VStack, useColorModeValue } from "@chakra-ui/react";
import { PlayIcon } from "@heroicons/react/24/solid";
import type { ReactNode } from "react";
import { useRef } from "react";

import AuthorCard from "@/components/author-card";
import ReadingProgress from "@/components/reading-progress";
import Section from "@/components/section";
import SubscribeCard from "@/components/subscribe-card";
import Layout from "@/layouts/layout";
import type { BlogPostSummary, NotionRecordMap } from "@/types/content";

interface BlogLayoutProps {
  children: ReactNode;
  post: BlogPostSummary;
  recordMap: NotionRecordMap | null;
}

const PlayIconWrapper = () => (
  <Icon
    as={PlayIcon}
    w={16}
    h={16}
    color={useColorModeValue("neutral.900", "neutral.900")}
    background="white"
    rounded="full"
    shadow="lg"
  />
);

const BlogLayout = ({ children, post, recordMap }: BlogLayoutProps) => {
  const target = useRef<HTMLElement | null>(null);
  const hasCoverImage = Boolean(post.coverImage);
  const hasCoverVideo = Boolean(post.coverVideo);

  return (
    <Layout>
      <Section>
        <article ref={target}>
          <VStack w="100%" align="stretch" spacing={6}>
            {hasCoverImage || hasCoverVideo ? (
              <Box mt={4} rounded="lg" shadow="md" overflow="hidden" lineHeight={0}>
                {hasCoverVideo ? (
                  <AspectRatio overflow="hidden" rounded="md" ratio={16 / 9}>
                    <ReactPlayer
                      width="100%"
                      height="100%"
                      url={post.coverVideo ?? undefined}
                      light={post.coverImage ?? true}
                      controls
                      playing
                      playIcon={<PlayIconWrapper />}
                    />
                  </AspectRatio>
                ) : (
                  <Image
                    alt={post.title}
                    src={post.coverImage ?? "/"}
                    width={2240}
                    height={1260}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                )}
              </Box>
            ) : null}
            <VStack align="stretch" spacing={6} mb={4}>
              <Heading as="h1">{post.title}</Heading>
              <AuthorCard
                publishedAt={post.publishDate}
                url={`https://danielwirtz.com/blog/${post.slug}`}
              />
            </VStack>
          </VStack>
          <div>{children}</div>
        </article>
      </Section>
      <Section mt={8}>
        <SubscribeCard
          title="Subscribe to my blog"
          description="Helpful tools, thoughtful articles and other findings from the web. From my desk to yours."
        />
      </Section>
      <ReadingProgress target={target} />
    </Layout>
  );
};

export default BlogLayout;
