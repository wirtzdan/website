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

export const SubscribeCard = ({
  title = "From the Desk",
  description = "Helpful tools, thoughtful articles and other findings from the web. From my desk to yours.",
  card = true,
  image = false,
  center = false,
}) => {
  return (
    <Stack
      w="100%"
      rounded="lg"
      borderWidth={card ? "1px" : "0px"}
      bg={card ? useColorModeValue("white", "neutralD.100") : "transparent"}
      borderColor={
        card ? useColorModeValue("neutral.400", "neutralD.400") : "transparent"
      }
      p={card ? 6 : 0}
      spacing={4}
    >
      <HStack
        spacing={{ base: 4, md: 8 }}
        w="100%"
        justifyContent={center ? "center" : "start"}
      >
        {image ? (
          <Image
            src="/newsletter-logo.png"
            borderRadius="full"
            boxSize={{ base: "80px", md: "150px" }}
            boxShadow="xs"
            filter={useColorModeValue("none", "invert(1)")}
          />
        ) : undefined}
        <VStack align="start">
          {title ? (
            <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }}>
              {title}
            </Text>
          ) : undefined}
          {description ? (
            <Text
              fontSize={{ base: "sm", md: "lg" }}
              color={useColorModeValue("neutral.1000", "neutralD.1000")}
            >
              {description}
            </Text>
          ) : undefined}
          <Subscribe
            direction="row"
            display={{ base: "none", md: "block" }}
            pt={2}
          />
        </VStack>
      </HStack>

      <Subscribe
        direction={{ base: "column", md: "row" }}
        display={{ base: "block", md: "none" }}
        w="100%"
      />
    </Stack>
  );
};

export default SubscribeCard;
