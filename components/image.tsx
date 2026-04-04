import NextImage, { type ImageProps } from "next/image";
import { chakra } from "@chakra-ui/react";

const Image = chakra(NextImage, {
  baseStyle: { maxH: 120, maxW: 120 },
  shouldForwardProp: (prop) =>
    ["width", "height", "src", "alt", "fill", "sizes", "quality"].includes(prop),
}) as typeof NextImage;

export type { ImageProps };
export default Image;
