import type { Metadata } from "next";
import { notFound } from "next/navigation";

import NotionPage from "@/components/notion-page";
import PageLayout from "@/layouts/page";
import { getDescriptionFromRecordMap } from "@/lib/blog-metadata";
import { getAllPages, getPageByPageId } from "@/lib/notion/api";
import { buildPageMetadata } from "@/lib/page-metadata";

export const revalidate = 3600;
// ISR regeneration walks every nested Notion block; give it room past the 15 s function limit.
export const maxDuration = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pages = await getAllPages();
  const page = pages.results.find((entry) => entry.slug === slug && entry.isPublished);
  if (!page) {
    return { title: "Page" };
  }
  const description =
    page.description ??
    getDescriptionFromRecordMap(await getPageByPageId(page.id)) ??
    `${page.title} – a page on danielwirtz.com, the personal website of Daniel Wirtz.`;
  return buildPageMetadata({ title: page.title, description, path: `/${page.slug}` });
}

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages.results.filter((page) => page.isPublished).map((page) => ({ slug: page.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pages = await getAllPages();
  const page = pages.results.find((entry) => entry.slug === slug);

  if (!page || !page.isPublished) {
    notFound();
  }

  const recordMap = await getPageByPageId(page.id);

  // A failed Notion fetch is not a missing page. Throwing keeps the last good
  // render during ISR; notFound() would cache a 404 until the next revalidate.
  if (!recordMap) {
    throw new Error(`Could not load Notion page ${page.id}`);
  }

  return (
    <PageLayout page={page}>
      <NotionPage recordMap={recordMap} />
    </PageLayout>
  );
}
