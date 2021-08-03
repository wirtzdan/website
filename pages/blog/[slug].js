import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import BlogLayout from "@/layouts/blog";
import MDXComponents from "@/components/mdx-components";
import { getAllPostsPaths, getPostData } from "../../lib/airtable";
import readingTime from "reading-time";

export default function Blog({ source, frontMatter }) {
  return (
    <BlogLayout frontMatter={frontMatter}>
      <MDXRemote {...source} components={MDXComponents} />
    </BlogLayout>
  );
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

  const mdxSource = await serialize(postData.post[0].fields.mdx, {
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
    revalidate: 1,
  };
}
