"use client";

import { Center, Heading, Text, VStack } from "@chakra-ui/react";

import Container from "@/components/container";
import Link from "@/components/link";

export default function NotFoundBody() {
  return (
    <Container>
      <Center>
        <VStack>
          <Heading as="h1" size="3xl">
            404
          </Heading>
          <Text mb={8}>Page not found</Text>
          <Link href="/">Return home</Link>
        </VStack>
      </Center>
    </Container>
  );
}
