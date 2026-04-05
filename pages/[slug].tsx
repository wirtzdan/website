import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

import NotionPage from "@/components/notion-page";
import PageLayout from "@/layouts/page";
import { getAllPages, getPageByPageId } from "@/lib/notion/api";
import type { GenericPageSummary, NotionRecordMap } from "@/types/content";

type DynamicPageProps = {
  page: GenericPageSummary;
  recordMap: NotionRecordMap;
  showNavigation: boolean;
};

export default function Page({
  page,
  recordMap,
  showNavigation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PageLayout page={page} showNavigation={showNavigation}>
      <NotionPage recordMap={recordMap} />
    </PageLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getAllPages({ pageSize: 9999 });

  return {
    paths: pages.results
      .filter((page) => page.isPublished)
      .map((page) => ({
        params: { slug: page.slug },
      })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<DynamicPageProps> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const pages = await getAllPages({ pageSize: 9999 });
  const page = pages.results.find((entry) => entry.slug === slug);

  if (!page || !page.isPublished) {
    return {
      notFound: true,
    };
  }

  const recordMap = await getPageByPageId(page.id);

  if (!recordMap) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page,
      recordMap,
      showNavigation: page.showNavigation ?? false,
    },
    revalidate: 10,
  };
};
