"use client";
import React from "react";
import { HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";

import Subscribe from "@/components/subscribe";

interface SubscribeCardProps {
  title?: string;
  description?: string;
  card?: boolean;
  image?: boolean;
  center?: boolean;
}

export const SubscribeCard = ({
  title = "From the Desk",
  description = "Helpful tools, thoughtful articles and other findings from the web. From my desk to yours.",
  card = true,
  image = false,
  center = false,
}: SubscribeCardProps) => {
  return (
    <Stack
      w="100%"
      rounded="lg"
      borderWidth={card ? "1px" : "0px"}
      bg={card ? "bg.panel" : "transparent"}
      borderColor={card ? "border" : "transparent"}
      p={card ? 6 : 0}
      gap={4}
    >
      <HStack gap={{ base: 4, md: 8 }} w="100%" justifyContent={center ? "center" : "start"}>
        {image ? (
          <Image
            src="/newsletter-logo.png"
            borderRadius="full"
            boxSize={{ base: "80px", md: "150px" }}
            boxShadow="xs"
            filter={{ base: "none", _dark: "invert(1)" }}
          />
        ) : null}
        <VStack align="start">
          {title ? (
            <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }}>
              {title}
            </Text>
          ) : null}
          {description ? (
            <Text fontSize={{ base: "sm", md: "lg" }} color="fg.muted">
              {description}
            </Text>
          ) : null}
          <Subscribe direction="row" display={{ base: "none", md: "block" }} pt={2} />
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
