"use client";

import Image from "next/image";
import { createContext, useContext, type CSSProperties } from "react";

import {
  canUseNextImage,
  isNotionImageProxy,
  notionContentImageLoader,
} from "@/lib/next-image-hosts";

type NotionContentImageProps = {
  src?: string;
  alt?: string;
  width?: number | null;
  height?: number | null;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  fill?: boolean | string;
};

const CONTENT_SIZES = "(max-width: 672px) 100vw, 672px";

/**
 * The src of the image that is likely the LCP element on this page (see
 * leadingNotionImageSrc). That image loads eagerly with high fetch priority;
 * every other content image stays lazy.
 */
export const NotionLeadingImageContext = createContext<string | undefined>(undefined);

export default function NotionContentImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  priority = false,
}: NotionContentImageProps) {
  const leadingSrc = useContext(NotionLeadingImageContext);

  if (!src) {
    return null;
  }

  const eager = priority || (leadingSrc !== undefined && src === leadingSrc);

  const frameWidth = typeof width === "number" && width > 0 ? width : null;
  const frameHeight = typeof height === "number" && height > 0 ? height : null;
  const description = alt ?? "";

  if (!frameWidth || !frameHeight || !canUseNextImage(src)) {
    return (
      <img
        src={src}
        alt={description}
        width={frameWidth ?? undefined}
        height={frameHeight ?? undefined}
        className={className}
        decoding="async"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        style={{ width: "100%", height: "auto", ...style }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={description}
      width={frameWidth}
      height={frameHeight}
      sizes={CONTENT_SIZES}
      className={className}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      {...(isNotionImageProxy(src) ? { loader: notionContentImageLoader } : {})}
      style={{ width: "100%", height: "auto", ...style }}
    />
  );
}
