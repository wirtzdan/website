"use client";
import React, { useCallback, useState } from "react";
import { Box, HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
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

const COVER_WIDTH = 90;
const COVER_HEIGHT = 135;

const placeholderIcon = {
  width: 28,
  height: 28,
  display: "block",
} as const;

const BookCard = ({ title, author, rating = 0, coverUrl, dateRead }: BookCardProps) => {
  const proxySrc = title ? bookCoverProxyPath(title, author) : undefined;
  const directSrc = durableCoverUrl(coverUrl);
  const [src, setSrc] = useState(proxySrc ?? directSrc ?? undefined);
  const [failed, setFailed] = useState(!src);

  const showFallback = useCallback(() => {
    if (directSrc && src !== directSrc) {
      setSrc(directSrc);
      return;
    }
    setFailed(true);
  }, [directSrc, src]);

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
            w={`${COVER_WIDTH}px`}
            h={`${COVER_HEIGHT}px`}
            flexShrink={0}
            overflow="hidden"
            shadow="lg"
            position="absolute"
            top={-4}
            bg={{ _light: "neutral.300", _dark: "neutralD.400" }}
            color={{ _light: "neutral.800", _dark: "neutralD.800" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {!failed ? <Skeleton position="absolute" inset="0" zIndex={0} /> : null}
            {src && !failed ? (
              <img
                className="book-cover"
                src={src}
                alt=""
                width={COVER_WIDTH}
                height={COVER_HEIGHT}
                loading="lazy"
                decoding="async"
                onError={showFallback}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                }}
              />
            ) : (
              <BookOpenIcon width={28} height={28} aria-hidden style={placeholderIcon} />
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
