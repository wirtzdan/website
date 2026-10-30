"use client";

import { Box, HStack, Skeleton, SkeletonText, Span, VStack } from "@chakra-ui/react";

import Section from "@/components/section";

const barProps = {
  variant: "pulse" as const,
  bg: { _light: "neutral.400", _dark: "neutralD.400" },
  _motionReduce: { animation: "none" },
};

/**
 * Title rule plus paragraph blocks, in the same 2xl column as an article.
 * Header, footer, and mobile nav stay in the route layout, outside this slot.
 */
export default function ArticleSkeleton({ showAuthor = false }: { showAuthor?: boolean }) {
  return (
    <Section>
      <article aria-busy="true">
        <Span srOnly>Loading</Span>
        <VStack w="100%" align="stretch" gap={6}>
          <VStack align="stretch" gap={6} mb={4}>
            <Box
              w="100%"
              borderBottomWidth="2px"
              borderColor={{ _light: "neutral.500", _dark: "neutralD.500" }}
              pb="2"
            >
              <Skeleton h="1.875rem" w={{ base: "84%", md: "62%" }} rounded="sm" {...barProps} />
            </Box>
            {showAuthor ? (
              <HStack gap={3}>
                <Skeleton boxSize="10" rounded="full" {...barProps} />
                <VStack align="start" gap={1}>
                  <Skeleton h="4" w="32" rounded="sm" {...barProps} />
                  <Skeleton h="3" w="24" rounded="sm" {...barProps} />
                </VStack>
              </HStack>
            ) : null}
          </VStack>
        </VStack>
        <VStack align="stretch" gap={8} w="100%">
          <SkeletonText noOfLines={4} gap="3" height="5" {...barProps} />
          <SkeletonText noOfLines={3} gap="3" height="5" {...barProps} />
        </VStack>
      </article>
    </Section>
  );
}
