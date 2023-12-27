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

class NewsletterLayout extends React.Component {
  render() {
    const target = React.createRef();

    return (
      <PageTransition>
        <>
          <Section>
            <BlogSeo
              url={`https://danielwirtz/blog/${this.props.post.Slug}`}
              image={this.props.post["Social Card"][0].thumbnails.large.url}
              title={this.props.post.Subject}
              publishDate={this.props.post["Published on"]}
              {...this.props.post}
            />
            <article ref={target}>
              <VStack w="100%" align="left" spacing={6}>
                <Box
                  mt={4}
                  rounded="lg"
                  shadow="md"
                  overflow="hidden"
                  lineHeight={0}
                >
                  <Image
                    alt={this.props.post.Subject}
                    src={this.props.post["Social Card"][0].thumbnails.large.url}
                    width={2240}
                    height={1260}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </Box>

                <VStack align="stretch" spacing={6} mb={4}>
                  <Heading as="h1">{this.props.post.Subject}</Heading>
                  <AuthorCard
                    publishedAt={this.props.post["Pulished On"]}
                    url={
                      "https://danielwirtz.com/archive/" + this.props.post.slug
                    }
                    readingTime={this.props.post.readingTime.text}
                  />
                </VStack>
              </VStack>
              <div>{this.props.children}</div>
            </article>
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

export default NewsletterLayout;
