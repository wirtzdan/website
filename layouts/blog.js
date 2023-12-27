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

    return (
      <PageTransition>
        <>
          <Section>
            <BlogSeo
              url={`https://danielwirtz/blog/${this.props.post.slug}`}
              image={this.props.post.coverImage}
              {...this.props.post}
            />
            <article ref={target}>
              <VStack w="100%" align="left" spacing={6}>
                {this.props.post.showBanner ? (
                  <Box
                    mt={4}
                    rounded="lg"
                    shadow="md"
                    overflow="hidden"
                    lineHeight={0}
                  >
                    <Image
                      alt={this.props.post.title}
                      src={this.props.post.coverImage}
                      width={2240}
                      height={1260}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                      }}
                    />
                  </Box>
                ) : undefined}
                {this.props.post.videoLink ? (
                  <AspectRatio
                    overflow="hidden"
                    rounded="md"
                    my={6}
                    ratio={16 / 9}
                  >
                    {this.props.post.videoLink.includes("jmp.sh") ||
                    this.props.post.videoLink.includes("facilitator.school") ? (
                      <iframe
                        src={this.props.post.videoLink}
                        frameborder="0"
                        webkitallowfullscreen
                        mozallowfullscreen
                        allowfullscreen
                        style={{
                          position: "absolute",
                          top: "0",
                          left: "0",
                          width: "100%",
                          height: "100%",
                        }}
                      ></iframe>
                    ) : (
                      <ReactPlayer
                        width="100%"
                        height="100%"
                        url={this.props.post.videoLink}
                        light={
                          this.props.post.coverImage
                            ? this.props.post.coverImage
                            : true
                        }
                        controls
                        playing
                        playIcon={<PlayIconWrapper />}
                      ></ReactPlayer>
                    )}
                  </AspectRatio>
                ) : undefined}
                <VStack align="stretch" spacing={6} mb={4}>
                  <Heading as="h1">{this.props.post.title}</Heading>
                  <AuthorCard
                    publishedAt={this.props.post.publishDate}
                    url={"https://danielwirtz.com/blog/" + this.props.post.slug}
                    // readingTime={this.props.post.readingTime.text}
                  />
                </VStack>
              </VStack>
              <div>{this.props.children}</div>
            </article>

            {/* <TwitterCard
              title={this.props.post.title}
              slug={this.props.post.slug}
            /> */}
            <div ref={(el) => (this.div = el)}></div>
          </Section>
          <Section mt={8}>
            <SubscribeCard title="Subscribe to my blog" description="" />
          </Section>
          <ReadingProgress target={target} />
        </>
      </PageTransition>
    );
  }
}

export default BlogLayout;
