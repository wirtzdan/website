import type { Metadata } from "next";

import type { NotionBlockWithValue, NotionRecordMapWithBlocks } from "@/types/content";

export const getDescriptionFromRecordMap = (recordMap?: NotionRecordMapWithBlocks | null) => {
  if (!recordMap) {
    return undefined;
  }

  const blocks = Object.values(recordMap.block ?? {}) as NotionBlockWithValue[];
  const firstTextBlock = blocks.find(
    (block) => block.value?.type === "text" && block.value?.properties?.title,
  );

  if (!firstTextBlock?.value?.properties?.title) {
    return undefined;
  }

  const extractedDescription = firstTextBlock.value.properties.title
    .map((segment) => segment[0])
    .join("")
    .trim();

  if (!extractedDescription) {
    return undefined;
  }

  return extractedDescription.length > 160
    ? `${extractedDescription.slice(0, 157)}...`
    : extractedDescription;
};

export function buildBlogPostMetadata(input: {
  title: string;
  description?: string | null;
  publishDate: string;
  slug: string;
  socialImage?: string | null;
  recordMap?: NotionRecordMapWithBlocks | null;
}): Metadata {
  const { title, description, publishDate, slug, socialImage, recordMap } = input;
  const url = `https://danielwirtz.com/blog/${slug}`;
  const date = new Date(publishDate).toISOString();
  const finalDescription = description ?? getDescriptionFromRecordMap(recordMap);

  const images =
    socialImage != null && socialImage !== ""
      ? [
          {
            url: socialImage,
            width: 1200,
            height: 630,
            alt: `${title} social image`,
          },
        ]
      : [];

  return {
    title,
    description: finalDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: finalDescription,
      publishedTime: date,
      modifiedTime: date,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: finalDescription,
      images: socialImage ? [socialImage] : undefined,
    },
  };
}
