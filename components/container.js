import React from "react";
import { Box } from "@chakra-ui/react";

export const Container = (props) => (
  <Box
    w="full"
    pb="12"
    pt="3"
    mx="auto"
    maxW="4xl"
    px={{ base: "6", md: "8" }}
    {...props}
  />
);

export default Container;
