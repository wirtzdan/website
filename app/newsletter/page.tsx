import NewsletterPage from "@/components/route-content/newsletter-page";
import Layout from "@/layouts/layout";
import { getAllNewsletters } from "@/lib/airtable";
import { newsletterMetadata } from "@/lib/page-metadata";

export const metadata = newsletterMetadata;

export const revalidate = 10;

export default async function Page() {
  const posts = await getAllNewsletters();

  return (
    <Layout>
      <NewsletterPage posts={posts} />
    </Layout>
  );
}
