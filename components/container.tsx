import { Box, type BoxProps } from "@chakra-ui/react";

export type ContainerProps = BoxProps;

export const Container = (props: ContainerProps) => (
  <Box w="full" mx="auto" maxW="2xl" px={{ base: "6", md: "8" }} {...props} />
);

export default Container;
