import React from "react";
import Link from "next/link";
import { format } from "timeago.js";

import { Box, VStack, Text, useColorModeValue } from "@chakra-ui/react";
const BlogPost = ({ title, summary, slug, lastUpdated }) => {
  return (
    <Link href={`/blog/${slug}`}>
      <Box as="a" cursor="pointer" w="100%">
        <VStack
          align="start"
          p={4}
          bg={useColorModeValue("white", "gray.800")}
          rounded="md"
          shadow="xs"
          spacing={0}
        >
          <Text
            color={useColorModeValue("blue.500", "blue.200")}
            fontWeight="bold"
            fontSize="xl"
          >
            {title}
          </Text>
          <Text fontSize="lg" color={useColorModeValue("gray.700", "gray.50")}>
            {summary}
          </Text>
          <Text fontSize="md" color={useColorModeValue("gray.500", "gray.400")}>
            Updated {format(lastUpdated)}
          </Text>
        </VStack>
      </Box>
    </Link>
  );
};

export default BlogPost;
