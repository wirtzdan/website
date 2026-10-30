"use client";
import React, { useState } from "react";
import { Box, HStack, Icon, Image, Text, VStack } from "@chakra-ui/react";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import { format } from "timeago.js";

import { bookCoverProxyPath, durableCoverUrl } from "@/lib/book-covers";

import { cardLiftProps, cardStillProps } from "./card-lift";
import StarIconRating from "./star-rating";

interface BookCardProps {
  title?: string;
  author?: string;
  rating?: number;
  isFavorite?: boolean;
  coverUrl?: string;
  dateRead?: string;
}

const BookCard = ({ title, author, rating = 0, coverUrl, dateRead }: BookCardProps) => {
  const proxySrc = title ? bookCoverProxyPath(title, author) : undefined;
  const directSrc = durableCoverUrl(coverUrl);
  const [src, setSrc] = useState(proxySrc ?? directSrc ?? undefined);
  const [failed, setFailed] = useState(!src);

  const showFallback = () => {
    if (directSrc && src !== directSrc) {
      setSrc(directSrc);
      return;
    }
    setFailed(true);
  };

  return (
    <Box asChild {...cardStillProps}>
      <a
        href={`https://www.goodreads.com/search?utf8=%E2%9C%93&q=${encodeURIComponent(title ?? "")}`}
        target="_blank"
        rel="noreferrer"
      >
        <HStack
          {...cardLiftProps}
          p={4}
          bg={{ _light: "white", _dark: "neutralD.100" }}
          rounded="lg"
          borderWidth="1px"
          borderColor={{ _light: "neutral.400", _dark: "neutralD.400" }}
          w="100%"
          textAlign="left"
          align="start"
          gap={4}
          height={36}
          position="relative"
        >
          <Box
            rounded="md"
            w="90px"
            minH="120px"
            overflow="hidden"
            shadow="lg"
            position="absolute"
            top={-4}
            backgroundColor="red.300"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {src && !failed ? (
              <Image
                src={src}
                objectFit="cover"
                w="100%"
                h="100%"
                minH="120px"
                alt={title ?? ""}
                onError={showFallback}
              />
            ) : (
              <Icon boxSize={8} color="red.800" aria-hidden asChild>
                <BookOpenIcon />
              </Icon>
            )}
          </Box>
          <VStack align="start" justify="flex-start" gap={1} maxW="lg" pl={28} h="100%">
            <VStack gap={0} align="start" flexGrow="1">
              <Text fontWeight="bold" fontSize="md" lineClamp={2}>
                {title}
              </Text>
              <Text fontSize="md" color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}>
                {author}
              </Text>
            </VStack>
            <VStack gap={0} align="start">
              <StarIconRating rating={rating} />
              <Text fontSize="xs" color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}>
                {dateRead ? format(dateRead) : ""}
              </Text>
            </VStack>
          </VStack>
        </HStack>
      </a>
    </Box>
  );
};

export default BookCard;
