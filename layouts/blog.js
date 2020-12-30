import React from "react";
import Section from "@/components/section";
import { Heading, VStack, Text, HStack } from "@chakra-ui/react";
import ReadingProgress from "@/components/reading-progress";
import BlogSeo from "@/components/blog-seo";

class BlogLayout extends React.Component {
  render() {
    const target = React.createRef();

    return (
      <>
        <Section>
          <BlogSeo
            url={`https://danielwirtz/blog/${this.props.slug}`}
            {...this.props.frontMatter}
          />
          <article ref={target}>
            <VStack w="100%" align="left">
              <Heading as="h1">{this.props.frontMatter.title}</Heading>
            </VStack>
            <div>{this.props.children}</div>
          </article>
          <div ref={(el) => (this.div = el)}></div>
        </Section>
        <ReadingProgress target={target} />
      </>
    );
  }
}

// export default function BlogLayout({ children, frontMatter }) {
//   const target = React.createRef();
//   console.log("🚀 ~ file: blog.js ~ line 15 ~ BlogLayout ~ target", target);

//   return (
//     <>
//       <Section pt={16} pb={{ base: 24, md: 16 }}>
//         {/* <BlogSeo
//         url={`https://leerob.io/blog/${frontMatter.slug}`}
//         {...frontMatter}
//       /> */}
//         <article>
//           <Heading as="h1">{frontMatter.title}</Heading>
//           <div>{children}</div>
//         </article>
//       </Section>
//       <ReadingProgress target={target} />
//     </>
//   );
// }

export default BlogLayout;
