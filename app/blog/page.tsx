import BlogIndexPage from "@/components/route-content/blog-index-page";
import Layout from "@/layouts/layout";
import { blogIndexMetadata } from "@/lib/page-metadata";
import { getBlogPosts } from "@/lib/notion/api";

export const metadata = blogIndexMetadata;

export const revalidate = 10;

export default async function Page() {
  const posts = await getBlogPosts({ pageSize: 9999 });

  return (
    <Layout>
      <BlogIndexPage posts={posts} />
    </Layout>
  );
}
