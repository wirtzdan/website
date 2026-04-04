import NextImage from "next/image";
import { Box, Heading, VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useRef } from "react";

import AuthorCard from "@/components/author-card";
import BlogSeo from "@/components/blog-seo";
import PageTransition from "@/components/page-transitions";
import ReadingProgress from "@/components/reading-progress";
import Section from "@/components/section";
import SubscribeCard from "@/components/subscribe-card";
import type { AirtableImage, NewsletterFields } from "@/types/content";

interface NewsletterLayoutProps {
  post: NewsletterFields;
  children: ReactNode;
}

const getSocialCardUrl = (socialCard?: AirtableImage[]) =>
  socialCard?.[0]?.thumbnails?.large?.url ?? null;

const NewsletterLayout = ({ post, children }: NewsletterLayoutProps) => {
  const target = useRef<HTMLElement | null>(null);
  const socialCardUrl = getSocialCardUrl(post["Social Card"]);

  return (
    <PageTransition>
      <>
        <Section>
          <BlogSeo
            title={post.Subject ?? "Newsletter"}
            publishDate={post["Published on"] ?? post["Pulished On"] ?? new Date().toISOString()}
            url={`https://danielwirtz.com/archive/${post.Slug ?? ""}`}
            socialImage={socialCardUrl}
          />
          <article ref={target}>
            <VStack w="100%" align="stretch" spacing={6}>
              {socialCardUrl ? (
                <Box mt={4} rounded="lg" shadow="md" overflow="hidden" lineHeight={0}>
                  <NextImage
                    alt={post.Subject ?? "Newsletter social card"}
                    src={socialCardUrl}
                    width={2240}
                    height={1260}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </Box>
              ) : null}

              <VStack align="stretch" spacing={6} mb={4}>
                <Heading as="h1">{post.Subject}</Heading>
                <AuthorCard
                  publishedAt={post["Pulished On"] ?? post["Published on"] ?? ""}
                  url={`https://danielwirtz.com/archive/${post.Slug ?? ""}`}
                />
              </VStack>
            </VStack>
            <div>{children}</div>
          </article>
        </Section>
        <Section mt={8}>
          <SubscribeCard title="Subscribe to my blog" description="" />
        </Section>
        <ReadingProgress target={target} />
      </>
    </PageTransition>
  );
};

export default NewsletterLayout;
