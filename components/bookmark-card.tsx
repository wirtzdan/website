"use client";
import React from "react";
import { AspectRatio, Box, Card, Image, Text, VStack, HStack } from "@chakra-ui/react";
import { format } from "timeago.js";

interface BookmarkCardProps {
  title: string;
  excerpt?: string;
  cover: string;
  type: string;
  link: string;
  created: string;
}

const BookmarkCard = ({ title, cover, type, link, created }: BookmarkCardProps) => {
  const handleClick = () => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <Card.Root
      variant="outline"
      interactive
      size="sm"
      w="100%"
      overflow="hidden"
      alignItems="stretch"
      gap={0}
      onClick={handleClick}
      cursor="pointer"
    >
      <Box position="relative" w="100%">
        <AspectRatio
          ratio={1.85 / 1}
          maxW="400px"
          w="100%"
          borderBottomWidth="1px"
          borderColor="border"
        >
          <Image src={cover} objectFit="cover" alt={title} />
        </AspectRatio>
      </Box>

      <Card.Body p={0} pt={2} px={4} pb={2}>
        <VStack gap={0} align="start">
          <Text fontSize="sm" lineClamp={1} fontWeight="500">
            {title}
          </Text>
          <HStack gap={1}>
            <Text fontSize="xs" fontWeight="500" color="fg" textTransform="capitalize">
              {type}
            </Text>
            <Text fontSize="xs" fontWeight="400" color="fg">
              – {format(created)}
            </Text>
          </HStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

export default BookmarkCard;
