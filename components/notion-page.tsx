import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";
import { Spinner as Loading } from "@chakra-ui/react";
import { getPageTitle } from "notion-utils";
import { NotionRenderer } from "react-notion-x";
import TweetEmbed from "react-tweet-embed";
import type { NotionRecordMap } from "@/types/content";

import Codeblock from "@/components/codeblock/codeblock";

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then((module) => module.Collection)
);

const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((module) => module.Equation)
);

const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((module) => module.Modal),
  {
    ssr: false,
  }
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
  return <TweetEmbed tweetId={id} />;
};

const NotionVideo = ({
  src,
  ...props
}: React.VideoHTMLAttributes<HTMLVideoElement> & { src?: string }) => {
  const [videoSrc, setVideoSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    if (src.includes("secure.notion-static.com") || src.includes("prod-files-secure")) {
      try {
        const encodedUrl = encodeURIComponent(src);
        setVideoSrc(`https://notion.so/signed/${encodedUrl}?table=block`);
      } catch (error) {
        console.error("Error creating signed video URL:", error);
        setVideoSrc(src);
      }
    } else {
      setVideoSrc(src);
    }

    setIsLoading(false);
  }, [src]);

  const handleError = (error: unknown) => {
    console.error("Video player error:", error);
    setHasError(true);
  };

  const handleReady = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div className="notion-video-error">
        <p style={{ margin: "0 0 1rem 0", color: "#666" }}>
          Video could not be loaded. This might be due to access restrictions or an expired URL.
        </p>
        <p style={{ margin: "0", fontSize: "0.9em", color: "#888" }}>
          Try uploading the video to YouTube, Vimeo, or another external platform and embedding
          the link instead.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="notion-video-loading">
        <Loading />
        <p style={{ marginTop: "1rem", color: "#666" }}>Loading video...</p>
      </div>
    );
  }

  if (videoSrc && ReactPlayer.canPlay(videoSrc)) {
    return (
      <div className="notion-video-player">
        <ReactPlayer
          url={videoSrc}
          width="100%"
          height="auto"
          controls
          onError={handleError}
          onReady={handleReady}
          config={{
            file: {
              attributes: {
                crossOrigin: "anonymous",
                ...props,
              },
            },
          }}
        />
      </div>
    );
  }

  return (
    <video
      {...props}
      src={videoSrc}
      controls
      className="notion-video-player"
      style={{ width: "100%", height: "auto" }}
      onError={handleError}
      onLoadStart={handleReady}
      crossOrigin="anonymous"
    >
      <p>
        Your browser doesn&apos;t support HTML5 video. Here is a <a href={videoSrc}>link to the
        video</a> instead.
      </p>
    </video>
  );
};

const mapVideoUrl = (
  url?: string | null,
  block?: {
    id?: string;
    space_id?: string;
  }
) => {
  if (!url) {
    return url;
  }

  if (url.includes("notion.so/signed")) {
    return url;
  }

  if (url.includes("secure.notion-static.com") || url.includes("prod-files-secure")) {
    try {
      const encodedUrl = encodeURIComponent(url);
      const blockId = block?.id ?? "";
      const spaceId = block?.space_id ?? "";

      let signedUrl = `https://notion.so/signed/${encodedUrl}?table=block`;
      if (blockId) signedUrl += `&id=${blockId}`;
      if (spaceId) signedUrl += `&spaceId=${spaceId}`;

      return signedUrl;
    } catch (error) {
      console.error("Error creating signed video URL:", error);
      return url;
    }
  }

  return url;
};

interface NotionPageProps {
  recordMap: NotionRecordMap | null;
  previewImagesEnabled?: boolean;
  rootPageId?: string;
  rootDomain?: string;
}

const NotionPage = ({
  recordMap,
  previewImagesEnabled,
  rootPageId,
  rootDomain,
}: NotionPageProps) => {
  const router = useRouter();

  if (router.isFallback) {
    return <Loading />;
  }

  if (!recordMap) {
    return null;
  }

  getPageTitle(recordMap);

  return (
    <TypedNotionRenderer
      recordMap={recordMap}
      hideBlockId
      darkMode={false}
      rootDomain={rootDomain}
      rootPageId={rootPageId}
      previewImages={previewImagesEnabled}
      showTableOfContents={false}
      showCollectionViewDropdown={false}
      fullPage={false}
      disableHeader
      components={{
        nextImage: Image,
        nextLink: Link,
        Code: Codeblock as React.ComponentType<{ block: NotionBlock }>,
        Collection,
        Equation,
        Modal,
        Tweet,
        Property: () => null,
        Header: () => null,
      } as React.ComponentProps<typeof NotionRenderer>["components"]}
    />
  );
};

export default NotionPage;
