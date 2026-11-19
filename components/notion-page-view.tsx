"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Box } from "@chakra-ui/react";
import { getPageTitle } from "notion-utils";
import { NotionRenderer } from "react-notion-x";
import TweetEmbed from "react-tweet-embed";
import type { NotionRecordMap } from "@/types/content";

import Codeblock from "@/components/codeblock/codeblock";
import NotionContentImage, { NotionLeadingImageContext } from "@/components/notion-content-image";
import { useColorMode } from "@/components/ui/color-mode";
import { mapNotionContentImageUrl } from "@/lib/notion-image-frame";

// Only pages that render Notion content need these. Importing them here instead
// of in the root layout keeps them off the render-blocking path of every other page.
import "@/lib/notion/notion-renderer-styles.css";
import "@/lib/notion/notion-custom-styles.css";

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then((module) => module.Collection),
);

const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((module) => module.Equation),
);

const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((module) => module.Modal),
  {
    ssr: false,
  },
);

const TypedNotionRenderer = NotionRenderer as React.ComponentType<Record<string, unknown>>;

type NotionBlock = {
  id?: string;
  space_id?: string;
  properties?: {
    language?: Array<[string]>;
    caption?: Array<[string]>;
  };
};

const Tweet = ({ id }: { id: string }) => {
  return (
    <Box minH="250px" w="100%">
      <TweetEmbed tweetId={id} />
    </Box>
  );
};

interface NotionPageViewProps {
  recordMap: NotionRecordMap;
  rootPageId?: string;
  rootDomain?: string;
  /** Src of the image likely to be the LCP element; loaded eagerly. */
  leadingImageSrc?: string;
}

const mapImageUrl = (url: string, block: { id?: string; parent_table?: string }) =>
  mapNotionContentImageUrl(url, block) ?? url;

export default function NotionPageView({
  recordMap,
  rootPageId,
  rootDomain,
  leadingImageSrc,
}: NotionPageViewProps) {
  const { colorMode } = useColorMode();
  // The leading image loads right away, and www.notion.so answers it with a
  // redirect to img.notionusercontent.com. Open that second connection early.
  // React hoists this <link> into <head>.
  const preconnectRedirectHost = leadingImageSrc?.startsWith("https://www.notion.so/image/");

  getPageTitle(recordMap);

  return (
    <NotionLeadingImageContext.Provider value={leadingImageSrc}>
      {preconnectRedirectHost ? (
        <link rel="preconnect" href="https://img.notionusercontent.com" />
      ) : null}
      <TypedNotionRenderer
        recordMap={recordMap}
        mapImageUrl={mapImageUrl}
        hideBlockId
        darkMode={colorMode === "dark"}
        rootDomain={rootDomain}
        rootPageId={rootPageId}
        previewImages
        showTableOfContents={false}
        showCollectionViewDropdown={false}
        fullPage={false}
        disableHeader
        components={
          {
            nextImage: NotionContentImage,
            nextLink: Link,
            Code: Codeblock as React.ComponentType<{ block: NotionBlock }>,
            Collection,
            Equation,
            Modal,
            Tweet,
            Property: () => null,
            Header: () => null,
          } as React.ComponentProps<typeof NotionRenderer>["components"]
        }
      />
    </NotionLeadingImageContext.Provider>
  );
}
