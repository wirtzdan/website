import NewsletterPage from "@/components/route-content/newsletter-page";
import { newsletterMetadata } from "@/lib/page-metadata";

export const metadata = newsletterMetadata;

export default function Page() {
  return <NewsletterPage />;
}
