import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BlogArticleJsonLd from "@/components/blog-article-json-ld";
import NotionPage from "@/components/notion-page";
import BlogLayout from "@/layouts/blog";
import { buildBlogPostMetadata, getDescriptionFromRecordMap } from "@/lib/blog-metadata";
import { getBlogPosts, getPageByPageId } from "@/lib/notion/api";

export const revalidate = 10;

export async function generateStaticParams() {
  const posts = await getBlogPosts({ pageSize: 9999 });
  return posts.results.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getBlogPosts({ pageSize: 9999 });
  const post = posts.results.find((entry) => entry.slug === slug);
  if (!post) {
    return { title: "Blog" };
  }
  const recordMap = await getPageByPageId(post.id);
  return buildBlogPostMetadata({
    title: post.title,
    description: post.description,
    publishDate: post.publishDate,
    slug: post.slug,
    socialImage: post.socialImage ?? null,
    recordMap: recordMap ?? undefined,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getBlogPosts({ pageSize: 9999 });
  const post = posts.results.find((entry) => entry.slug === slug) ?? null;

  if (!post) {
    notFound();
  }

  const postPage = await getPageByPageId(post.id);

  if (!postPage) {
    notFound();
  }

  const postWithSocial = { ...post, socialImage: post.socialImage ?? null };
  const description = post.description ?? getDescriptionFromRecordMap(postPage) ?? undefined;

  return (
    <>
      <BlogArticleJsonLd
        title={post.title}
        description={description}
        publishDate={post.publishDate}
        url={`https://danielwirtz.com/blog/${post.slug}`}
        socialImage={post.socialImage}
      />
      <BlogLayout post={postWithSocial} recordMap={postPage}>
        <NotionPage recordMap={postPage} />
      </BlogLayout>
    </>
  );
}
