import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import NewsletterLayout from "@/layouts/newsletter";
import MDXComponents from "@/components/mdx-components";
import { getAllNewsletterPaths, getNewsletterData } from "../../lib/airtable";
import readingTime from "reading-time";
import remarkAutoLinkHeadings from "remark-autolink-headings";
import remarkSlug from "remark-slug";
import remarkCodeTitles from "remark-code-titles";

export default function Journal({ source, frontMatter }) {
  return (
    <NewsletterLayout frontMatter={frontMatter}>
      <MDXRemote {...source} components={MDXComponents} />
    </NewsletterLayout>
  );
}

export async function getStaticPaths() {
  const paths = await getAllNewsletterPaths();

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const newsletterData = await getNewsletterData(params.slug);

  const mdxSource = await serialize(
    newsletterData.newsletter[0].fields.Markdown,
    {
      mdxOptions: {
        remarkPlugins: [remarkAutoLinkHeadings, remarkSlug, remarkCodeTitles],
      },
    }
  );

  return {
    props: {
      source: mdxSource,
      frontMatter: {
        wordCount:
          newsletterData.newsletter[0].fields.Markdown.split(/\s+/gu).length,
        readingTime: readingTime(newsletterData.newsletter[0].fields.Markdown),
        ...newsletterData.newsletter[0].fields,
      },
    },
    revalidate: 30,
  };
}
