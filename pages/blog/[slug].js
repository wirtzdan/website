import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";
import BlogLayout from "@/layouts/blog-2";
import MDXComponents from "@/components/mdx-components";
import { getAllPostsPaths, getPostData } from "../../lib/airtable";
import readingTime from "reading-time";

export default function Blog({ source, frontMatter }) {
  const content = hydrate(source, {
    components: MDXComponents,
  });

  return <BlogLayout frontMatter={frontMatter}>{content}</BlogLayout>;
}

export async function getStaticPaths() {
  const paths = await getAllPostsPaths();

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);

  const mdxSource = await renderToString(postData.post[0].fields.mdx, {
    components: MDXComponents,
    mdxOptions: {
      remarkPlugins: [
        require("remark-autolink-headings"),
        require("remark-slug"),
        require("remark-code-titles"),
      ],
    },
  });

  return {
    props: {
      source: mdxSource,
      frontMatter: {
        wordCount: postData.post[0].fields.mdx.split(/\s+/gu).length,
        readingTime: readingTime(postData.post[0].fields.mdx),
        ...postData.post[0].fields,
      },
    },
  };
}
