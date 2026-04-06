"use client";
import React from "react";
import { HStack, Icon } from "@chakra-ui/react";
import { RiStarFill } from "@remixicon/react";

interface StarIconRatingProps {
  rating?: number;
}

const StarIconRating = ({ rating = 0 }: StarIconRatingProps) => {
  const stars = Math.max(0, Math.min(5, rating));

  return (
    <HStack gap={0} align="center">
      {Array.from({ length: stars }, (_, index) => (
        <Icon w={4} h={4} color="yellow.solid" asChild>
          <RiStarFill key={`filled-${index}`} />
        </Icon>
      ))}
      {Array.from({ length: 5 - stars }, (_, index) => (
        <Icon w={4} h={4} color="gray.emphasized" asChild>
          <RiStarFill key={`empty-${index}`} />
        </Icon>
      ))}
    </HStack>
  );
};

export default StarIconRating;
