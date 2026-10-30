"use client";

import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";

import Container from "@/components/container";
import Link from "@/components/link";
import { uiCopy } from "@/lib/ui-copy";

export default function RouteError({ reset }: { reset: () => void }) {
  return (
    <Container>
      <Center>
        <VStack gap={6} align="center" maxW="65ch">
          <Heading as="h1" size="xl" textAlign="center">
            {uiCopy.error.title}
          </Heading>
          <Text textAlign="center">{uiCopy.error.description}</Text>
          <Button onClick={() => reset()}>{uiCopy.error.retry}</Button>
          <Link href="/">{uiCopy.error.home}</Link>
        </VStack>
      </Center>
    </Container>
  );
}
