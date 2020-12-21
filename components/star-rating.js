import React, { useState } from "react";
import { Box, HStack, Icon, useColorModeValue } from "@chakra-ui/react";
import { Star } from "heroicons-react";

const StarRating = ({ rating }) => {
  const [stars] = useState(rating);

  return (
    <HStack spacing={0}>
      {Array(stars).fill(
        <Icon as={Star} color={useColorModeValue("yellow.400", "yellow.200")} />
      )}
      {Array(5 - stars).fill(
        <Icon as={Star} color={useColorModeValue("gray.300", "gray.600")} />
      )}
    </HStack>
  );
};

export default StarRating;
