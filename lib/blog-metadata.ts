import type { Metadata } from "next";

import { SITE_NAME, siteMetadata } from "@/lib/site-metadata";
import { absoluteUrl } from "@/lib/site-url";
import type { NotionBlockWithValue, NotionRecordMapWithBlocks } from "@/types/content";

const MAX_DESCRIPTION_LENGTH = 160;

/**
 * Shortens text to at most `max` characters. Prefers ending on a full sentence;
 * otherwise cuts at the last word boundary and adds "…".
 */
export function trimDescription(text: string, max = MAX_DESCRIPTION_LENGTH): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) {
    return normalized;
  }

  const window = normalized.slice(0, max);
  const sentenceEnd = Math.max(
    window.lastIndexOf(". "),
    window.lastIndexOf("! "),
    window.lastIndexOf("? "),
  );
  // Only settle for a sentence if it keeps most of the description.
  if (sentenceEnd >= max / 2) {
    return window.slice(0, sentenceEnd + 1);
  }

  const room = normalized.slice(0, max - 1);
  const wordEnd = room.lastIndexOf(" ");
  const cut = wordEnd > 0 ? room.slice(0, wordEnd) : room;
  return `${cut.replace(/[\s,;:.!?–—-]+$/, "")}…`;
}

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

  return trimDescription(extractedDescription);
};

export const SOCIAL_CARD_SIZE = { width: 1200, height: 630 };

/** URL of the generated title card used when a post has no Notion "Social Image". */
export const blogCardUrl = (slug: string) => absoluteUrl(`/og/blog/${slug}`);

export function blogPostImage(post: { title: string; slug: string; socialImage?: string | null }) {
  return {
    url: post.socialImage || blogCardUrl(post.slug),
    ...SOCIAL_CARD_SIZE,
    alt: post.title,
  };
}

export function buildBlogPostMetadata(input: {
  title: string;
  description?: string | null;
  publishDate: string;
  modifiedDate?: string | null;
  slug: string;
  socialImage?: string | null;
  recordMap?: NotionRecordMapWithBlocks | null;
}): Metadata {
  const { title, description, publishDate, modifiedDate, slug, socialImage, recordMap } = input;
  const url = absoluteUrl(`/blog/${slug}`);
  const publishedTime = new Date(publishDate).toISOString();
  const modifiedTime = modifiedDate ? new Date(modifiedDate).toISOString() : publishedTime;
  const finalDescription = description ?? getDescriptionFromRecordMap(recordMap);
  const socialTitle = `${title} – ${SITE_NAME}`;
  const image = blogPostImage({ title, slug, socialImage });

  return {
    title,
    description: finalDescription,
    alternates: { canonical: url },
    openGraph: {
      ...siteMetadata.openGraph,
      type: "article",
      url,
      title: socialTitle,
      description: finalDescription,
      publishedTime,
      modifiedTime,
      authors: [absoluteUrl("/about")],
      images: [image],
    },
    twitter: {
      ...siteMetadata.twitter,
      title: socialTitle,
      description: finalDescription,
      images: [image],
    },
  };
}
