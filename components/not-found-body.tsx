"use client";

import NextLink from "next/link";
import { Center, Heading, Text, VStack } from "@chakra-ui/react";

import Container from "@/components/container";
import Layout from "@/layouts/layout";

export default function NotFoundBody() {
  return (
    <Layout>
      <Container>
        <Center>
          <VStack>
            <Heading size="3xl">404</Heading>
            <Text mb={8}>Page not found</Text>
            <NextLink href="/">Return home</NextLink>
          </VStack>
        </Center>
      </Container>
    </Layout>
  );
}
