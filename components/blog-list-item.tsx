"use client";

import React from "react";
import { Heading, HStack, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { format } from "timeago.js";

import Link from "@/components/link";

interface BlogListItemProps {
  slug: string;
  publishDate: string;
  title: string;
  videoLink?: string | null;
}

const BlogListItem = ({ slug, publishDate, title, videoLink }: BlogListItemProps) => {
  return (
    <Link href={`/blog/${slug}`} unstyled>
      <HStack
        w="100%"
        rounded="lg"
        borderWidth="1px"
        bg={useColorModeValue("white", "neutralD.100")}
        borderColor={useColorModeValue("neutral.400", "neutralD.400")}
        position="relative"
        align="center"
        px={4}
        p={4}
        spacing={4}
        transition="all 0.3s"
        transitionTimingFunction="spring(1 100 10 10)"
        _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
        height="100%"
      >
        <VStack align="start" justifyContent="space-between" w="100%" h="100%" p={2} spacing={0}>
          <VStack align="start">
            <HStack>
              <Heading fontSize="lg" borderBottom="0" fontWeight="500">
                {title}
              </Heading>
            </HStack>
          </VStack>
          <HStack
            fontSize="sm"
            fontWeight="400"
            spacing={2}
            color={useColorModeValue("neutral.900", "neutralD.900")}
          >
            <Text>Posted {format(publishDate)}</Text>
            <Text>·</Text>
            <HStack spacing={1}>
              <Text>{videoLink ? "Video" : "Article"}</Text>
            </HStack>
          </HStack>
        </VStack>
      </HStack>
    </Link>
  );
};

export default BlogListItem;
