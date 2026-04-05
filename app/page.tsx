import HomePage from "@/components/route-content/home-page";
import Layout from "@/layouts/layout";
import { homeMetadata } from "@/lib/page-metadata";
import { getBlogPosts } from "@/lib/notion/api";

export const metadata = homeMetadata;

export const revalidate = 10;

export default async function Page() {
  const posts = await getBlogPosts({ pageSize: 9999 });

  return (
    <Layout>
      <HomePage posts={posts} />
    </Layout>
  );
}
