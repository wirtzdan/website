import JsonLd from "@/components/json-ld";
import HomePage from "@/components/route-content/home-page";
import { personJsonLd, websiteJsonLd } from "@/lib/json-ld";
import { homeMetadata } from "@/lib/page-metadata";
import { getBlogPosts } from "@/lib/notion/api";

export const metadata = homeMetadata;

export const revalidate = 3600;

export default async function Page() {
  const posts = await getBlogPosts();

  return (
    <>
      <JsonLd data={[websiteJsonLd(), personJsonLd()]} />
      <HomePage posts={posts} />
    </>
  );
}
