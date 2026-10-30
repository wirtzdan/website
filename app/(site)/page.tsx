import HomePage from "@/components/route-content/home-page";
import { homeMetadata } from "@/lib/page-metadata";
import { getBlogPosts } from "@/lib/notion/api";

export const metadata = homeMetadata;

export const revalidate = 3600;

export default async function Page() {
  const posts = await getBlogPosts();

  return <HomePage posts={posts} />;
}
