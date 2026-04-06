import NextImage, { type ImageProps } from "next/image";
import { Box } from "@chakra-ui/react";

function Image(props: ImageProps) {
  return (
    <Box display="inline-block" maxH={120} maxW={120}>
      <NextImage {...props} />
    </Box>
  );
}

export type { ImageProps };
export default Image;
