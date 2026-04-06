"use client";
import React from "react";
import { Card, Heading, HStack, Text, VStack } from "@chakra-ui/react";
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
      <Card.Root
        variant="outline"
        interactive
        size="sm"
        w="100%"
        h="100%"
        position="relative"
        flexDirection="row"
        alignItems="center"
      >
        <Card.Body flex="1">
          <VStack align="start" justifyContent="space-between" w="100%" h="100%" p={2} gap={0}>
            <VStack align="start">
              <HStack>
                <Heading fontSize="lg" borderBottom="0" fontWeight="500">
                  {title}
                </Heading>
              </HStack>
            </VStack>
            <HStack fontSize="sm" fontWeight="400" gap={2} color="fg">
              <Text>Posted {format(publishDate)}</Text>
              <Text>·</Text>
              <HStack gap={1}>
                <Text>{videoLink ? "Video" : "Article"}</Text>
              </HStack>
            </HStack>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Link>
  );
};

export default BlogListItem;
