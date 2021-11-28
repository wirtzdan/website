import React from "react";
import {
  VStack,
  useColorModeValue,
  Text,
  Stack,
  Image,
  Box,
  HStack,
} from "@chakra-ui/react";
import Subscribe from "@/components/subscribe";

export const SubscribeCard = ({ title = "Subscribe", description }) => {
  return (
    <Stack
      w="100%"
      rounded="lg"
      borderWidth="1px"
      bg={useColorModeValue("white", "neutralD.100")}
      borderColor={useColorModeValue("neutral.400", "neutralD.400")}
      p={6}
      spacing={4}
    >
      <HStack spacing={8}>
        <Image
          src="/newsletter-logo.png"
          borderRadius="full"
          boxSize={{ base: "100px", md: "150px" }}
          boxShadow="xs"
          filter={useColorModeValue("none", "invert(1)")}
        />
        <VStack align="start">
          <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }}>
            {title}
          </Text>
          <Text
            fontSize={{ base: "sm", md: "lg" }}
            color={useColorModeValue("neutral.1000", "neutralD.1000")}
          >
            {description}
          </Text>
          <Subscribe
            direction="row"
            display={{ base: "none", md: "block" }}
            pt={2}
          />
        </VStack>
      </HStack>
      <Subscribe direction="row" display={{ base: "block", md: "none" }} />
    </Stack>
  );
};

export default SubscribeCard;
