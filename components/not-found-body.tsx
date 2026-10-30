"use client";

import NextLink from "next/link";
import { Center, Heading, Text, VStack } from "@chakra-ui/react";

import Container from "@/components/container";

export default function NotFoundBody() {
  return (
    <Container>
      <Center>
        <VStack>
          <Heading as="h1" size="3xl">
            404
          </Heading>
          <Text mb={8}>Page not found</Text>
          <NextLink href="/">Return home</NextLink>
        </VStack>
      </Center>
    </Container>
  );
}
