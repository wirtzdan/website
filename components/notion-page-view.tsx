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
import NotionContentImage from "@/components/notion-content-image";
import { useColorMode } from "@/components/ui/color-mode";

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
}

export default function NotionPageView({ recordMap, rootPageId, rootDomain }: NotionPageViewProps) {
  const { colorMode } = useColorMode();

  getPageTitle(recordMap);

  return (
    <TypedNotionRenderer
      recordMap={recordMap}
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
  );
}
