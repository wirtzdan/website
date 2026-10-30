import Image from "next/image";
import type { CSSProperties } from "react";

import { canUseNextImage } from "@/lib/next-image-hosts";

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

export default function NotionContentImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  priority = false,
}: NotionContentImageProps) {
  if (!src) {
    return null;
  }

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
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
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
      priority={priority}
      style={{ width: "100%", height: "auto", ...style }}
    />
  );
}
