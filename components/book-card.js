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
} from "@chakra-ui/react";
import Image from "next/image";
import { Star } from "heroicons-react";
import StarRating from "./star-rating";

const BookCard = ({ title, author, rating, isFavorite }) => {
  return (
    <HStack
      p={4}
      bg={useColorModeValue("white", "gray.800")}
      rounded="md"
      shadow="xs"
      w="100%"
      textAlign="left"
      justify="space-between"
      align="start"
    >
      <VStack align="start" justify="flex-start" spacing={1} maxW="lg" h="100%">
        <HStack></HStack>
        <VStack flexGrow="1" spacing={0} align="start">
          <Text fontWeight="bold" fontSize="lg" noOfLines={2}>
            {title}
          </Text>
          <Text fontSize="md" color={useColorModeValue("gray.500", "gray.200")}>
            {author}
          </Text>
        </VStack>

        {rating ? (
          /* <Tag colorScheme="orange" size="lg">
          {" "}
          <TagLabel> {rating}</TagLabel>
          <TagRightIcon ml={0} boxSize="16px" as={Star} />
        </Tag> */
          <StarRating rating={rating} />
        ) : undefined}
      </VStack>
    </HStack>
  );
};

export default BookCard;
