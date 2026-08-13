"use client";
import React from "react";
import { useColorModeValue } from "./ui/color-mode";
import { HStack, Icon } from "@chakra-ui/react";
import { StarIcon } from "@heroicons/react/24/solid";

interface StarIconRatingProps {
  rating?: number;
}

const StarIconRating = ({ rating = 0 }: StarIconRatingProps) => {
  const stars = Math.max(0, Math.min(5, rating));

  return (
    <HStack gap={0} align="center">
      {Array.from({ length: stars }, (_, index) => (
        <Icon w={4} h={4} color={useColorModeValue("yellow.400", "yellow.200")} asChild>
          <StarIcon key={`filled-${index}`} />
        </Icon>
      ))}
      {Array.from({ length: 5 - stars }, (_, index) => (
        <Icon w={4} h={4} color={useColorModeValue("gray.300", "gray.600")} asChild>
          <StarIcon key={`empty-${index}`} />
        </Icon>
      ))}
    </HStack>
  );
};

export default StarIconRating;
