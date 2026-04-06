import AboutPage from "@/components/route-content/about-page";
import Layout from "@/layouts/layout";
import { aboutMetadata } from "@/lib/page-metadata";

export const metadata = aboutMetadata;

export default function Page() {
  return (
    <Layout>
      <AboutPage />
    </Layout>
  );
}
