"use client";

import React from "react";
import { HStack, Icon, useColorModeValue } from "@chakra-ui/react";
import { StarIcon } from "@heroicons/react/24/solid";

interface StarIconRatingProps {
  rating?: number;
}

const StarIconRating = ({ rating = 0 }: StarIconRatingProps) => {
  const stars = Math.max(0, Math.min(5, rating));

  return (
    <HStack spacing={0} align="center">
      {Array.from({ length: stars }, (_, index) => (
        <Icon
          key={`filled-${index}`}
          w={4}
          h={4}
          as={StarIcon}
          color={useColorModeValue("yellow.400", "yellow.200")}
        />
      ))}
      {Array.from({ length: 5 - stars }, (_, index) => (
        <Icon
          key={`empty-${index}`}
          w={4}
          h={4}
          as={StarIcon}
          color={useColorModeValue("gray.300", "gray.600")}
        />
      ))}
    </HStack>
  );
};

export default StarIconRating;
