import type { Metadata } from "next";
import { notFound } from "next/navigation";

import NotionPage from "@/components/notion-page";
import PageLayout from "@/layouts/page";
import { getAllPages, getPageByPageId } from "@/lib/notion/api";

export const revalidate = 10;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pages = await getAllPages({ pageSize: 9999 });
  const page = pages.results.find((entry) => entry.slug === slug && entry.isPublished);
  if (!page) {
    return { title: "Page" };
  }
  return {
    title: page.title,
    alternates: { canonical: `https://danielwirtz.com/${page.slug}` },
  };
}

export async function generateStaticParams() {
  const pages = await getAllPages({ pageSize: 9999 });
  return pages.results.filter((page) => page.isPublished).map((page) => ({ slug: page.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pages = await getAllPages({ pageSize: 9999 });
  const page = pages.results.find((entry) => entry.slug === slug);

  if (!page || !page.isPublished) {
    notFound();
  }

  const recordMap = await getPageByPageId(page.id);

  if (!recordMap) {
    notFound();
  }

  return (
    <PageLayout page={page} showNavigation={page.showNavigation ?? false}>
      <NotionPage recordMap={recordMap} />
    </PageLayout>
  );
}
