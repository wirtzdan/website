import React from "react";
import {
  HStack,
  VStack,
  Text,
  useColorModeValue,
  Tag,
  TagLabel,
  TagRightIcon,
  Box,
  Image as ChakraImage,
  Icon,
  Link,
} from "@chakra-ui/react";
import Image from "next/image";
import { Eye, EyeOutline, Star } from "heroicons-react";
import StarRating from "./star-rating";
import { format, render, cancel, register } from "timeago.js";

const BookCard = ({ title, author, rating, isFavorite, cover, dateRead }) => {
  return (
    <a
      href={
        "https://www.goodreads.com/search?utf8=%E2%9C%93&q=" +
        encodeURIComponent(title)
      }
      target="_blank"
    >
      <HStack
        p={4}
        bg={useColorModeValue("white", "gray.800")}
        rounded="xl"
        borderWidth="1px"
        borderColor={useColorModeValue("gray.100", "gray.700")}
        w="100%"
        textAlign="left"
        align="start"
        spacing={4}
        height={36}
        position="relative"
        transition="all 0.25s"
        transition-timing-function="spring(1 100 10 10)"
        _hover={{ transform: "translateY(-4px)", shadow: "sm" }}
      >
        <Box
          rounded="md"
          h="144px"
          w="90px"
          overflow="hidden"
          shadow="lg"
          position="absolute"
          bottom={4}
        >
          <Image
            src={cover ? cover[0].thumbnails.large.url : "/"}
            height={96}
            width={60}
            layout="responsive"
          ></Image>
        </Box>
        <VStack
          align="start"
          justify="flex-start"
          spacing={1}
          maxW="lg"
          pl={24}
          h="100%"
        >
          <VStack spacing={0} align="start" flexGrow="1">
            <Text fontWeight="bold" fontSize="md" noOfLines={2}>
              {title}
            </Text>
            <Text
              fontSize="md"
              color={useColorModeValue("gray.500", "gray.200")}
            >
              {author}
            </Text>
          </VStack>
          <VStack spacing={0} align="start">
            <StarRating rating={rating} />
            <Text fontSize="xs" color="gray.400">
              {format(dateRead)}
            </Text>
          </VStack>
        </VStack>
      </HStack>
    </a>
  );
};

export default BookCard;
