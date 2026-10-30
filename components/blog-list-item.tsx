"use client";
import React from "react";
import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { format } from "timeago.js";

import Link from "@/components/link";

import { cardLiftProps, cardStillProps } from "./card-lift";

interface BlogListItemProps {
  slug: string;
  publishDate: string;
  title: string;
  videoLink?: string | null;
}

const BlogListItem = ({ slug, publishDate, title, videoLink }: BlogListItemProps) => {
  return (
    <Link href={`/blog/${slug}`} unstyled>
      <Box {...cardStillProps}>
        <HStack
          {...cardLiftProps}
          w="100%"
          rounded="lg"
          borderWidth="1px"
          bg={{ _light: "white", _dark: "neutralD.100" }}
          borderColor={{ _light: "neutral.400", _dark: "neutralD.400" }}
          position="relative"
          align="center"
          px={4}
          p={4}
          gap={4}
          height="100%"
        >
          <VStack align="start" justifyContent="space-between" w="100%" h="100%" p={2} gap={0}>
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
              gap={2}
              color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}
            >
              <Text>Posted {format(publishDate)}</Text>
              <Text>·</Text>
              <HStack gap={1}>
                <Text>{videoLink ? "Video" : "Article"}</Text>
              </HStack>
            </HStack>
          </VStack>
        </HStack>
      </Box>
    </Link>
  );
};

export default BlogListItem;
