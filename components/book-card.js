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
  Image,
} from "@chakra-ui/react";
import StarIconRating from "./star-rating";
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
        transition-timing-function="spring(1 100 10 10)"
        _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
      >
        <Box
          rounded="md"
          // h="144px"
          w="90px"
          overflow="hidden"
          shadow="lg"
          position="absolute"
          top={-4}
          backgroundColor="red.300"
        >
          <Image
            src={cover ? cover[0].thumbnails.large.url : "/"}
            fit="cover"
          ></Image>
        </Box>
        <VStack
          align="start"
          justify="flex-start"
          spacing={1}
          maxW="lg"
          pl={28}
          h="100%"
        >
          <VStack spacing={0} align="start" flexGrow="1">
            <Text fontWeight="bold" fontSize="md" noOfLines={2}>
              {title}
            </Text>
            <Text
              fontSize="md"
              color={useColorModeValue("neutral.900", "neutralD.1000")}
            >
              {author}
            </Text>
          </VStack>
          <VStack spacing={0} align="start">
            <StarIconRating rating={rating} />
            <Text fontSize="xs" color="neutral.800">
              {format(dateRead)}
            </Text>
          </VStack>
        </VStack>
      </HStack>
    </a>
  );
};

export default BookCard;
