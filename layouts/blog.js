import Image from "next/image";
import { parseISO, format } from "date-fns";

// import Subscribe from "@/components/Subscribe";
// import ViewCounter from "@/components/ViewCounter";
// import BlogSeo from "@/components/BlogSeo";
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
    <Section py={16}>
      {/* <BlogSeo
        url={`https://leerob.io/blog/${frontMatter.slug}`}
        {...frontMatter}
      /> */}
      <article>
        <Heading as="h1">{frontMatter.title}</Heading>

        {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mt-2 mb-8">
          <div className="flex items-center">
            <Image
              alt="Lee Robinson"
              height={24}
              width={24}
              src="/avatar.jpg"
              className="rounded-full"
            />
            <p className="text-sm text-gray-700 dark:text-gray-300 ml-2">
              {frontMatter.by}
              {"Lee Robinson / "}
              {format(parseISO(frontMatter.publishedAt), "MMMM dd, yyyy")}
            </p>
          </div>
          <p className="text-sm text-gray-500 min-w-32 mt-2 md:mt-0">
            {frontMatter.readingTime.text}
            {` • `}
            <ViewCounter slug={frontMatter.slug} />
          </p>
        </div> */}
        <div>{children}</div>
        {/* <div className="mt-8"><Subscribe /></div> */}
        {/* <div className="text-sm text-gray-700 dark:text-gray-300">
          <a
            href={discussUrl(frontMatter.slug)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {"Discuss on Twitter"}
          </a>
          {` • `}
          <a
            href={editUrl(frontMatter.slug)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {"Edit on GitHub"}
          </a>
        </div> */}
      </article>
    </Section>
  );
}
