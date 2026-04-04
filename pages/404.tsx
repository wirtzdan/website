import NextLink from "next/link";
import { Center, Heading, Text, VStack } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

import Container from "@/components/container";
import Layout from "@/layouts/layout";

export default function NotFound() {
  return (
    <Layout>
      <Container>
        <Center>
          <NextSeo
            title="404 – Daniel Wirtz"
            canonical="https://danielwirtz.com/404"
            openGraph={{
              url: "https://danielwirtz.com/404",
              title: "404 – Daniel Wirtz",
            }}
          />
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
