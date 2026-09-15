import BreadPage from "@/components/route-content/bread-page";
import Layout from "@/layouts/layout";
import { breadMetadata } from "@/lib/page-metadata";

export const metadata = breadMetadata;

export default function Page() {
  return (
    <Layout>
      <BreadPage />
    </Layout>
  );
}
