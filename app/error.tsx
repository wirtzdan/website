"use client";

import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";

import Container from "@/components/container";
import Link from "@/components/link";
import Layout from "@/layouts/layout";

export default function RouteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Layout>
      <Container>
        <Center>
          <VStack gap={6} align="center" maxW="65ch">
            <Heading as="h1" size="xl" textAlign="center">
              This page didn't load
            </Heading>
            <Text textAlign="center">I hit a snag while putting this page together.</Text>
            <Button onClick={() => reset()}>Try again</Button>
            <Link href="/">Return home</Link>
          </VStack>
        </Center>
      </Container>
    </Layout>
  );
}
