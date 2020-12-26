import React, { useState } from "react";
import { Box, HStack, Icon, useColorModeValue, Text } from "@chakra-ui/react";
import { Star } from "heroicons-react";

const StarRating = ({ rating }) => {
  const [stars] = useState(rating);

  return (
    <HStack spacing={0} align="center">
      {/* <Icon
        w={[2, 4]}
        height={[2, 4]}
        as={Star}
        color={useColorModeValue("yellow.400", "yellow.200")}
      />
      <Text fontSize="xs">{rating}</Text> */}
      {Array.from(Array(stars), (_, i) => (
        <Icon
          key={i}
          w={4}
          height={4}
          as={Star}
          color={useColorModeValue("yellow.400", "yellow.200")}
        />
      ))}
      {Array.from(Array(5 - stars), (_, i) => (
        <Icon
          key={i}
          w={4}
          height={4}
          as={Star}
          color={useColorModeValue("gray.300", "gray.600")}
        />
      ))}
    </HStack>
  );
};

export default StarRating;
