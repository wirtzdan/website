import * as React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";

import { getPageTitle } from "notion-utils";
import { NotionRenderer } from "react-notion-x";
import TweetEmbed from "react-tweet-embed";

import { Spinner as Loading } from "@chakra-ui/react";
import Codeblock from "../components/codeblock/codeblock";

// -----------------------------------------------------------------------------
// dynamic imports for optional components
// -----------------------------------------------------------------------------

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then(async (m) => {
    await Promise.all([
      import("prismjs/components/prism-markup-templating.js"),
      import("prismjs/components/prism-markup.js"),
      import("prismjs/components/prism-bash.js"),
      import("prismjs/components/prism-c.js"),
      import("prismjs/components/prism-cpp.js"),
      import("prismjs/components/prism-csharp.js"),
      import("prismjs/components/prism-docker.js"),
      import("prismjs/components/prism-java.js"),
      import("prismjs/components/prism-js-templates.js"),
      import("prismjs/components/prism-coffeescript.js"),
      import("prismjs/components/prism-diff.js"),
      import("prismjs/components/prism-git.js"),
      import("prismjs/components/prism-go.js"),
      import("prismjs/components/prism-graphql.js"),
      import("prismjs/components/prism-handlebars.js"),
      import("prismjs/components/prism-less.js"),
      import("prismjs/components/prism-makefile.js"),
      import("prismjs/components/prism-markdown.js"),
      import("prismjs/components/prism-objectivec.js"),
      import("prismjs/components/prism-ocaml.js"),
      import("prismjs/components/prism-python.js"),
      import("prismjs/components/prism-reason.js"),
      import("prismjs/components/prism-rust.js"),
      import("prismjs/components/prism-sass.js"),
      import("prismjs/components/prism-scss.js"),
      import("prismjs/components/prism-solidity.js"),
      import("prismjs/components/prism-sql.js"),
      import("prismjs/components/prism-stylus.js"),
      import("prismjs/components/prism-swift.js"),
      import("prismjs/components/prism-wasm.js"),
      import("prismjs/components/prism-yaml.js"),
    ]);
    return m.Code;
  })
);
const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);

const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
);

const Tweet = ({ id }) => {
  return <TweetEmbed tweetId={id} />;
};

// Enhanced Video component to handle Notion's signed URLs and various video formats
const NotionVideo = ({ src, ...props }) => {
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

    // If the URL contains secure.notion-static.com or similar Notion URLs, try to create a signed URL
    if (
      src.includes("secure.notion-static.com") ||
      src.includes("prod-files-secure")
    ) {
      try {
        const encodedUrl = encodeURIComponent(src);
        const signedUrl = `https://notion.so/signed/${encodedUrl}?table=block`;
        setVideoSrc(signedUrl);
      } catch (error) {
        console.error("Error creating signed video URL:", error);
        setVideoSrc(src);
      }
    } else {
      setVideoSrc(src);
    }

    setIsLoading(false);
  }, [src]);

  const handleError = (error) => {
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
          Video could not be loaded. This might be due to access restrictions or
          an expired URL.
        </p>
        <p style={{ margin: "0", fontSize: "0.9em", color: "#888" }}>
          Try uploading the video to YouTube, Vimeo, or another external
          platform and embedding the link instead.
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

  // Check if it's a supported video URL that ReactPlayer can handle
  if (ReactPlayer.canPlay(videoSrc)) {
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

  // Fallback to native HTML5 video element
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
        Your browser doesn't support HTML5 video. Here is a{" "}
        <a href={videoSrc}>link to the video</a> instead.
      </p>
    </video>
  );
};

// Function to map video URLs to handle Notion's signed URLs
const mapVideoUrl = (url, block) => {
  if (!url) return url;

  // If it's already a signed URL, return as is
  if (url.includes("notion.so/signed")) {
    return url;
  }

  // If it's a Notion asset URL, create a signed URL
  if (
    url.includes("secure.notion-static.com") ||
    url.includes("prod-files-secure")
  ) {
    try {
      const encodedUrl = encodeURIComponent(url);

      // Extract block ID and space ID from the recordMap if available
      const blockId = block?.id || "";
      const spaceId = block?.space_id || "";

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

const NotionPage = ({
  recordMap,
  previewImagesEnabled,
  rootPageId,
  rootDomain,
}) => {
  const router = useRouter();

  if (router.isFallback) {
    return <Loading />;
  }

  if (!recordMap) {
    return null;
  }

  const title = getPageTitle(recordMap);

  // useful for debugging from the dev console
  // if (typeof window !== "undefined") {
  //   const keys = Object.keys(recordMap?.block || {});
  //   const block = recordMap?.block?.[keys[0]]?.value;
  //   const g = window;
  //   g.recordMap = recordMap;
  //   g.block = block;
  // }

  return (
    <>
      <NotionRenderer
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
        mapVideoUrl={mapVideoUrl}
        components={{
          nextImage: Image,
          nextLink: Link,
          Code: Codeblock,
          Collection,
          Equation,
          Modal,
          Tweet,
          Video: NotionVideo,
          Property: () => null,
          Header: () => null,
        }}
        // NOTE: custom images will only take effect if previewImages is true and
        // if the image has a valid preview image defined in recordMap.preview_images[src]
      />
    </>
  );
};

export default NotionPage;
