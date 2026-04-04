import React from "react";
import { Box, HStack, Image, Text, VStack, useColorModeValue } from "@chakra-ui/react";
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
      <HStack
        p={4}
        bg={useColorModeValue("white", "neutralD.100")}
        rounded="lg"
        borderWidth="1px"
        borderColor={useColorModeValue("neutral.400", "neutralD.400")}
        w="100%"
        textAlign="left"
        align="start"
        spacing={4}
        height={36}
        position="relative"
        transition="all 0.3s"
        transitionTimingFunction="spring(1 100 10 10)"
        _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
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
          <Image src={cover?.[0]?.thumbnails.large.url ?? "/"} fit="cover" alt={title} />
        </Box>
        <VStack align="start" justify="flex-start" spacing={1} maxW="lg" pl={28} h="100%">
          <VStack spacing={0} align="start" flexGrow="1">
            <Text fontWeight="bold" fontSize="md" noOfLines={2}>
              {title}
            </Text>
            <Text fontSize="md" color={useColorModeValue("neutral.900", "neutralD.1000")}>
              {author}
            </Text>
          </VStack>
          <VStack spacing={0} align="start">
            <StarIconRating rating={rating} />
            <Text fontSize="xs" color="neutral.800">
              {dateRead ? format(dateRead) : ""}
            </Text>
          </VStack>
        </VStack>
      </HStack>
    </a>
  );
};

export default BookCard;
