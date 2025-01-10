import React from "react";
import Section from "@/components/section";
import {
  Heading,
  VStack,
  Box,
  Icon,
  useColorModeValue,
  AspectRatio,
} from "@chakra-ui/react";
import ReadingProgress from "@/components/reading-progress";
import BlogSeo from "@/components/blog-seo";
import TwitterCard from "@/components/twitter-card";
import AuthorCard from "@/components/author-card";
import Image from "next/image";
import PageTransition from "../components/page-transitions";
import ReactPlayer from "react-player/youtube";
import { PlayIcon } from "@heroicons/react/24/solid";
import SubscribeCard from "@/components/subscribe-card";
import Layout from "@/layouts/layout";

const PlayIconWrapper = () => {
  return (
    <Icon
      as={PlayIcon}
      w={16}
      h={16}
      color={useColorModeValue("neutral.900", "neutral.900")}
      weight="fill"
      background="white"
      rounded="full"
      shadow="lg"
    />
  );
};

class BlogLayout extends React.Component {
  render() {
    const target = React.createRef();
    const { post } = this.props;
    const hasCoverImage = Boolean(post.coverImage);
    const hasCoverVideo = Boolean(post.coverVideo);

    return (
      <Layout>
        <>
          <Section>
            <BlogSeo
              url={`https://danielwirtz/blog/${post.slug}`}
              socialImage={post.socialImage}
              recordMap={this.props.children.props.recordMap}
              {...post}
            />
            <article ref={target}>
              <VStack w="100%" align="left" spacing={6}>
                {(hasCoverImage || hasCoverVideo) && (
                  <Box
                    mt={4}
                    rounded="lg"
                    shadow="md"
                    overflow="hidden"
                    lineHeight={0}
                  >
                    {hasCoverVideo ? (
                      <AspectRatio
                        overflow="hidden"
                        rounded="md"
                        ratio={16 / 9}
                      >
                        <ReactPlayer
                          width="100%"
                          height="100%"
                          url={post.coverVideo}
                          light={post.coverImage || true}
                          controls
                          playing
                          playIcon={<PlayIconWrapper />}
                        />
                      </AspectRatio>
                    ) : (
                      <Image
                        alt={post.title}
                        src={post.coverImage}
                        width={2240}
                        height={1260}
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                      />
                    )}
                  </Box>
                )}
                <VStack align="stretch" spacing={6} mb={4}>
                  <Heading as="h1">{post.title}</Heading>
                  <AuthorCard
                    publishedAt={post.publishDate}
                    url={"https://danielwirtz.com/blog/" + post.slug}
                    // readingTime={post.readingTime.text}
                  />
                </VStack>
              </VStack>
              <div>{this.props.children}</div>
            </article>
            {/* <TwitterCard
              title={post.title}
              slug={post.slug}
            /> */}
            <div ref={(el) => (this.div = el)}></div>
          </Section>
          <Section mt={8}>
            <SubscribeCard title="Subscribe to my blog" description="Helpful tools, thoughtful articles and other findings from the web. From my desk to yours." />
          </Section>
          <ReadingProgress target={target} />
        </>
      </Layout>
    );
  }
}

export default BlogLayout;
