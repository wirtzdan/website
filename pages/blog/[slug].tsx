import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { format } from "date-fns";

import NotionPage from "@/components/notion-page";
import BlogLayout from "@/layouts/blog";
import { getBlogPosts, getPageByPageId } from "@/lib/notion/api";
import type { BlogPostSummary, NotionRecordMap } from "@/types/content";

interface BlogPostPageProps {
  post: BlogPostSummary | null;
  postRecordMap: NotionRecordMap | null;
}

export default function BlogPostPage({
  post,
  postRecordMap,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!post || !postRecordMap) {
    return null;
  }

  return (
    <BlogLayout post={post} recordMap={postRecordMap}>
      <NotionPage recordMap={postRecordMap} />
    </BlogLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getBlogPosts({ pageSize: 9999 });

  return {
    paths: posts.results.map((post) => ({
      params: {
        slug: post.slug,
        year: format(new Date(post.publishDate), "yyyy"),
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const posts = await getBlogPosts({ pageSize: 9999 });
  const post = posts.results.find((entry) => entry.slug === slug) ?? null;

  if (!post) {
    return {
      props: {
        post: null,
        postRecordMap: null,
      },
      revalidate: 10,
    };
  }

  const postPage = await getPageByPageId(post.id);

  return {
    props: {
      post: {
        ...post,
        socialImage: post.socialImage ?? null,
      },
      postRecordMap: postPage,
    },
    revalidate: 10,
  };
};
