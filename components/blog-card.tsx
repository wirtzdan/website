"use client";
import React from "react";
import { Card, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { format } from "timeago.js";

import Link from "@/components/link";

interface BlogCardProps {
  slug: string;
  publishDate: string;
  title: string;
  type?: string;
}

const BlogCard = ({ slug, publishDate, title, type }: BlogCardProps) => {
  return (
    <Link href={`/blog/${slug}`} unstyled>
      <Card.Root variant="outline" interactive size="sm" w="100%" h="100%" position="relative">
        <Card.Body gap={4}>
          <VStack align="start" justifyContent="space-between" w="100%" h="100%" p={1} pt={0}>
            <VStack align="start">
              <HStack>
                <Heading fontSize="xl" borderBottom="0">
                  {title}
                </Heading>
              </HStack>
            </VStack>
            <HStack fontSize="sm" fontWeight="500" gap={2} color="fg">
              <Text>Posted {format(publishDate)}</Text>
              <Text>·</Text>
              <HStack gap={1}>
                <Text>{type === "Video" ? "Video" : "Article"}</Text>
              </HStack>
            </HStack>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Link>
  );
};

export default BlogCard;
