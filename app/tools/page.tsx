import ToolsPage from "@/components/route-content/tools-page";
import Layout from "@/layouts/layout";
import { getTable, type ToolFields } from "@/lib/airtable";
import { toolsMetadata } from "@/lib/page-metadata";

export const metadata = toolsMetadata;

export const revalidate = 10;

export default async function Page() {
  const tools = await getTable<ToolFields>("Tools");

  return (
    <Layout>
      <ToolsPage tools={tools} />
    </Layout>
  );
}
