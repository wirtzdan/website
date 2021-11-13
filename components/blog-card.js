import React from "react";
import Link from "next/link";
import { format } from "timeago.js";
import {
  Box,
  VStack,
  Text,
  useColorModeValue,
  Tag,
  HStack,
  AspectRatio,
  Image,
} from "@chakra-ui/react";

const BlogCard = ({ slug, publishDate, summary, title }) => {
  return (
    <Link href={`/blog/${slug}`}>
      <Box
        as="a"
        cursor="pointer"
        w="100%"
        transition="all 0.25s"
        transition-timing-function="spring(1 100 10 10)"
        _hover={{ transform: "translateY(-4px)", shadow: "sm" }}
      >
        <VStack
          align="start"
          p={6}
          bg={useColorModeValue("white", "neutralD.100")}
          rounded="lg"
          borderWidth="1px"
          borderColor={useColorModeValue("neutral.400", "neutralD.400")}
          spacing={0}
        >
          <HStack>
            <Text
              fontSize="xl"
              color={useColorModeValue("neutral.1100", "neutralD.1100")}
              pb={1}
            >
              {title}{" "}
              {new Date() - new Date(publishDate) < 1000 * 60 * 60 * 24 * 7 ? (
                <Tag size="md" mt={1} ml={1} colorScheme="green">
                  New
                </Tag>
              ) : undefined}
            </Text>
          </HStack>

          <Text
            fontSize="md"
            color={useColorModeValue("neutral.900", "neutralD.900")}
          >
            {format(publishDate)}
          </Text>
        </VStack>
      </Box>
    </Link>
  );
};

export default BlogCard;
