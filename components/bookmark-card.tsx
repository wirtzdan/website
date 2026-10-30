"use client";

import { AspectRatio, Box, Image, Text, VStack, HStack } from "@chakra-ui/react";
import { format } from "timeago.js";

import { cardLiftProps, cardStillProps } from "./card-lift";

interface BookmarkCardProps {
  title: string;
  excerpt?: string;
  cover: string;
  type: string;
  link: string;
  created: string;
}

const BookmarkCard = ({ title, cover, type, link, created }: BookmarkCardProps) => {
  return (
    <Box asChild {...cardStillProps} color="inherit" textDecoration="none" cursor="pointer">
      <a href={link} target="_blank" rel="noopener noreferrer">
        <VStack
          {...cardLiftProps}
          w="100%"
          rounded="lg"
          borderWidth="1px"
          bg={{ _light: "white", _dark: "neutralD.100" }}
          borderColor={{ _light: "neutral.400", _dark: "neutralD.400" }}
          overflow="hidden"
          align="start"
          gap={0}
        >
          <Box position="relative" w="100%">
            <AspectRatio
              ratio={1.85 / 1}
              maxW="400px"
              w="100%"
              borderBottomWidth="1px"
              borderColor={{ _light: "neutral.400", _dark: "neutralD.400" }}
            >
              {cover ? (
                <Image src={cover} objectFit="cover" alt={title} loading="lazy" decoding="async" />
              ) : (
                <Box />
              )}
            </AspectRatio>
          </Box>

          <VStack py={2} px={4} gap={0} align="start">
            <Text fontSize="sm" lineClamp={1} fontWeight="500">
              {title}
            </Text>
            <HStack gap={1}>
              <Text
                fontSize="xs"
                fontWeight="500"
                color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}
                textTransform="capitalize"
              >
                {type}
              </Text>
              <Text
                fontSize="xs"
                fontWeight="400"
                color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}
              >
                – {format(created)}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </a>
    </Box>
  );
};

export default BookmarkCard;
