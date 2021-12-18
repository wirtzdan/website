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
import { PlayCircle } from "phosphor-react";
import SubscribeCard from "@/components/subscribe-card";

const PlayIcon = () => {
  return (
    <Icon
      as={PlayCircle}
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

    return (
      <PageTransition>
        <>
          <Section>
            <BlogSeo
              url={`https://danielwirtz/blog/${this.props.frontMatter.slug}`}
              image={this.props.frontMatter.banner[0].thumbnails.large.url}
              {...this.props.frontMatter}
            />
            <article ref={target}>
              <VStack w="100%" align="left" spacing={6}>
                {this.props.frontMatter.showBanner ? (
                  <Box
                    mt={4}
                    rounded="lg"
                    shadow="md"
                    overflow="hidden"
                    lineHeight={0}
                  >
                    <Image
                      alt={this.props.frontMatter.title}
                      src={
                        this.props.frontMatter.banner[0].thumbnails.large.url
                      }
                      width={2240}
                      height={1260}
                    />
                  </Box>
                ) : undefined}
                {this.props.frontMatter.videoLink ? (
                  <AspectRatio
                    overflow="hidden"
                    rounded="md"
                    my={6}
                    ratio={16 / 9}
                  >
                    <ReactPlayer
                      width="100%"
                      height="100%"
                      url={this.props.frontMatter.videoLink}
                      light={
                        this.props.frontMatter.banner[0].thumbnails.large.url
                          ? this.props.frontMatter.banner[0].thumbnails.large
                              .url
                          : true
                      }
                      controls
                      playing
                      playIcon={<PlayIcon />}
                    ></ReactPlayer>
                  </AspectRatio>
                ) : undefined}
                <VStack align="stretch" spacing={6} mb={4}>
                  <Heading as="h1">{this.props.frontMatter.title}</Heading>
                  <AuthorCard
                    publishedAt={this.props.frontMatter.publishDate}
                    url={
                      "https://danielwirtz.com/blog/" +
                      this.props.frontMatter.slug
                    }
                    readingTime={this.props.frontMatter.readingTime.text}
                  />
                </VStack>
              </VStack>
              <div>{this.props.children}</div>
            </article>

            {/* <TwitterCard
              title={this.props.frontMatter.title}
              slug={this.props.frontMatter.slug}
            /> */}
            <div ref={(el) => (this.div = el)}></div>
          </Section>
          <Section mt={8}>
            <SubscribeCard
              title="Subscribe to my newsletter"
              description="Helpful tools, thoughtful articles and other findings from the web. From my desk to yours."
            />
          </Section>
          <ReadingProgress target={target} />
        </>
      </PageTransition>
    );
  }
}

export default BlogLayout;
