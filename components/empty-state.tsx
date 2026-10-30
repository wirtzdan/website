"use client";

import { Center, type CenterProps, Text, VStack } from "@chakra-ui/react";

type EmptyStateProps = CenterProps & {
  title: string;
  description: string;
};

export default function EmptyState({ title, description, minH = "36", ...rest }: EmptyStateProps) {
  return (
    <Center
      w="100%"
      minH={minH}
      px={6}
      py={8}
      rounded="lg"
      borderWidth="1px"
      borderColor={{ _light: "neutral.400", _dark: "neutralD.400" }}
      bg={{ _light: "white", _dark: "neutralD.100" }}
      {...rest}
    >
      <VStack gap={2} maxW="65ch" textAlign="center">
        <Text fontWeight="600" textWrap="balance">
          {title}
        </Text>
        <Text color={{ _light: "neutral.1000", _dark: "neutralD.1000" }} textWrap="pretty">
          {description}
        </Text>
      </VStack>
    </Center>
  );
}
