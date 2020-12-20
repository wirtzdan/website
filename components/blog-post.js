import React from "react";
import Link from "next/link";

import { Box, VStack, Text, useColorModeValue } from "@chakra-ui/react";
const BlogPost = ({ title, summary, slug }) => {
  return (
    <Link href={`/blog/${slug}`}>
      <Box as="a" cursor="pointer" w="100%">
        <VStack
          align="start"
          p={4}
          bg={useColorModeValue("white", "gray.800")}
          rounded="md"
          shadow="xs"
        >
          <Text
            color={useColorModeValue("blue.500", "blue.200")}
            fontWeight="bold"
            fontSize="xl"
          >
            {title}
          </Text>
          <Text fontSize="lg" color={useColorModeValue("gray.500", "gray.200")}>
            {summary}
          </Text>
        </VStack>
      </Box>
    </Link>
  );
};

export default BlogPost;
