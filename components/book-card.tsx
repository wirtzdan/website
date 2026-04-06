"use client";
import React from "react";
import { Box, Card, Image, Text, VStack } from "@chakra-ui/react";
import { format } from "timeago.js";

import StarIconRating from "./star-rating";
import type { AirtableImage } from "@/types/content";

interface BookCardProps {
  title?: string;
  author?: string;
  rating?: number;
  isFavorite?: boolean;
  cover?: AirtableImage[];
  dateRead?: string;
}

const BookCard = ({ title, author, rating = 0, cover, dateRead }: BookCardProps) => {
  return (
    <a
      href={`https://www.goodreads.com/search?utf8=%E2%9C%93&q=${encodeURIComponent(title ?? "")}`}
      target="_blank"
      rel="noreferrer"
    >
      <Card.Root
        variant="outline"
        interactive
        size="sm"
        display="flex"
        flexDirection="row"
        alignItems="stretch"
        gap={4}
        p={4}
        w="100%"
        h={36}
        position="relative"
      >
        <Box
          rounded="md"
          w="90px"
          overflow="hidden"
          shadow="lg"
          position="absolute"
          top={-4}
          backgroundColor="red.300"
        >
          <Image src={cover?.[0]?.thumbnails.large.url ?? "/"} objectFit="cover" alt={title} />
        </Box>
        <VStack align="start" justify="flex-start" gap={1} maxW="lg" pl={28} h="100%">
          <VStack gap={0} align="start" flexGrow="1">
            <Text fontWeight="bold" fontSize="md" lineClamp={2}>
              {title}
            </Text>
            <Text fontSize="md" color="fg.muted">
              {author}
            </Text>
          </VStack>
          <VStack gap={0} align="start">
            <StarIconRating rating={rating} />
            <Text fontSize="xs" color="fg.subtle">
              {dateRead ? format(dateRead) : ""}
            </Text>
          </VStack>
        </VStack>
      </Card.Root>
    </a>
  );
};

export default BookCard;
