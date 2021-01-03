import React from "react";
import Section from "@/components/section";
import {
  Heading,
  VStack,
  Text,
  HStack,
  Box,
  Button,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import ReadingProgress from "@/components/reading-progress";
import BlogSeo from "@/components/blog-seo";
import TwitterCard from "@/components/twitter-card";
import AuthorCard from "@/components/author-card";
import Image from "next/image";

class BlogLayout extends React.Component {
  render() {
    const target = React.createRef();

    return (
      <>
        <Section>
          <BlogSeo
            url={`https://danielwirtz/blog/${this.props.frontMatter.slug}`}
            {...this.props.frontMatter}
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
                {" "}
                <Image
                  alt={this.props.frontMatter.title}
                  src={this.props.frontMatter.image}
                  width={2240}
                  height={1260}
                />
              </Box>

              <VStack align="stretch" spacing={4}>
                <Heading as="h1">{this.props.frontMatter.title}</Heading>
                <AuthorCard
                  publishedAt={this.props.frontMatter.publishedAt}
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
          <TwitterCard
            title={this.props.frontMatter.title}
            slug={this.props.frontMatter.slug}
          />
          <div ref={(el) => (this.div = el)}></div>
        </Section>
        <ReadingProgress target={target} />
      </>
    );
  }
}

export default BlogLayout;
