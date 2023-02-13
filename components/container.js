import React from "react";
import { Box } from "@chakra-ui/react";

export const Container = (props) => (
  <Box w="full" mx="auto" maxW="2xl" px={{ base: "6", md: "8" }} {...props} />
);

export default Container;
