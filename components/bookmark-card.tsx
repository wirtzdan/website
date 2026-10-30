"use client";

import { useColorModeValue } from "./ui/color-mode";
import { AspectRatio, Box, Image, Text, VStack, HStack } from "@chakra-ui/react";
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
  return (
    <Box asChild display="block" color="inherit" textDecoration="none" cursor="pointer">
      <a href={link} target="_blank" rel="noopener noreferrer">
        <VStack
          w="100%"
          rounded="lg"
          borderWidth="1px"
          bg={useColorModeValue("white", "neutralD.100")}
          borderColor={useColorModeValue("neutral.400", "neutralD.400")}
          transition="all 0.25s"
          transitionTimingFunction="spring(1 100 10 10)"
          _hover={{
            transform: "translateY(-4px)",
            shadow: "lg",
            textDecoration: "none",
          }}
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
              borderColor={useColorModeValue("neutral.400", "neutralD.400")}
            >
              <Image src={cover} objectFit="cover" alt={title} />
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
                color={useColorModeValue("neutral.1000", "neutralD.1000")}
                textTransform="capitalize"
              >
                {type}
              </Text>
              <Text
                fontSize="xs"
                fontWeight="400"
                color={useColorModeValue("neutral.1000", "neutralD.1000")}
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
