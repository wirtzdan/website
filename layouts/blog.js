import React from "react";
import Section from "@/components/section";
import { Heading } from "@chakra-ui/react";

// const editUrl = (slug) =>
//   `https://github.com/leerob/leerob.io/edit/master/data/blog${slug}.mdx`;
// const discussUrl = (slug) =>
//   `https://mobile.twitter.com/search?q=${encodeURIComponent(
//     `https://leerob.io/blog${slug}`
//   )}`;

export default function BlogLayout({ children, frontMatter }) {
  return (
    <Section pt={16} pb={{ base: 24, md: 16 }}>
      {/* <BlogSeo
        url={`https://leerob.io/blog/${frontMatter.slug}`}
        {...frontMatter}
      /> */}
      <article>
        <Heading as="h1">{frontMatter.title}</Heading>
        <div>{children}</div>
      </article>
    </Section>
  );
}
