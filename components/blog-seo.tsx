import { ArticleJsonLd, NextSeo } from "next-seo";

import type { NotionBlockWithValue, NotionRecordMapWithBlocks } from "@/types/content";

interface BlogSeoProps {
  title: string;
  description?: string | null;
  publishDate: string;
  url: string;
  socialImage?: string | null;
  recordMap?: NotionRecordMapWithBlocks | null;
}

const getDescriptionFromRecordMap = (
  recordMap?: NotionRecordMapWithBlocks | null
) => {
  if (!recordMap) {
    return undefined;
  }

  const blocks = Object.values(recordMap.block ?? {}) as NotionBlockWithValue[];
  const firstTextBlock = blocks.find(
    (block) => block.value?.type === "text" && block.value?.properties?.title
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

const BlogSeo = ({
  title,
  description,
  publishDate,
  url,
  socialImage,
  recordMap,
}: BlogSeoProps) => {
  const date = new Date(publishDate).toISOString();
  const finalDescription = description ?? getDescriptionFromRecordMap(recordMap);
  const images = socialImage
    ? [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: `${title} social image`,
        },
      ]
    : [];

  return (
    <>
      <NextSeo
        title={`${title} – Daniel Wirtz`}
        description={finalDescription}
        canonical={url}
        openGraph={{
          type: "article",
          article: {
            publishedTime: date,
          },
          url,
          title,
          description: finalDescription,
          images,
        }}
      />
      <ArticleJsonLd
        authorName="Daniel Wirtz"
        dateModified={date}
        datePublished={date}
        description={finalDescription}
        images={socialImage ? [socialImage] : []}
        publisherLogo="/static/favicons/android-chrome-192x192.png"
        publisherName="Daniel Wirtz"
        title={title}
        url={url}
      />
    </>
  );
};

export default BlogSeo;
