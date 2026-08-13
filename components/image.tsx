import NextImage, { type ImageProps } from "next/image";
import { chakra } from "@chakra-ui/react";

const Image = chakra(NextImage);

export type { ImageProps };
export default Image;
