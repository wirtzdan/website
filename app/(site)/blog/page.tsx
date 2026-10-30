import BlogIndexPage from "@/components/route-content/blog-index-page";
import { blogIndexMetadata } from "@/lib/page-metadata";
import { getBlogPosts } from "@/lib/notion/api";

export const metadata = blogIndexMetadata;

export const revalidate = 3600;

export default async function Page() {
  const posts = await getBlogPosts();

  return <BlogIndexPage posts={posts} />;
}
