"use client";
import React from "react";
import { HStack, Icon } from "@chakra-ui/react";
import { RiStarFill, RiStarLine } from "@remixicon/react";

interface StarIconRatingProps {
  rating?: number;
}

const StarIconRating = ({ rating = 0 }: StarIconRatingProps) => {
  const stars = Math.max(0, Math.min(5, rating));

  return (
    <HStack gap={0} align="center">
      {Array.from({ length: stars }, (_, index) => (
        <Icon
          key={`filled-${index}`}
          w={4}
          h={4}
          color={{ _light: "yellow.400", _dark: "yellow.200" }}
          asChild
        >
          <RiStarFill />
        </Icon>
      ))}
      {Array.from({ length: 5 - stars }, (_, index) => (
        <Icon
          key={`empty-${index}`}
          w={4}
          h={4}
          color={{ _light: "neutral.700", _dark: "neutralD.900" }}
          asChild
        >
          <RiStarLine />
        </Icon>
      ))}
    </HStack>
  );
};

export default StarIconRating;
