import React from "react";
import Head from "next/head";
import {
  Button,
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Link,
} from "@chakra-ui/react";
import Container from "../components/container";
import PageTransition from "../components/page-transitions";
import Section from "@/components/section";

const Home = () => (
  <Box flexGrow="1">
    <PageTransition>
      <Section py={16}>
        <VStack spacing={2}>
          <Text fontSize="3xl">Hey, I'm Daniel 👋</Text>
          <Text
            fontSize="4xl"
            fontWeight="500"
            lineHeight={1.25}
            textAlign="center"
            mb={4}
          >
            I'm a a designer, developer and maker of things. Born in Germany and
            now living in Utrecht, Netherlands.
          </Text>
          <Link href="https://twitter.com/wirtzdan" isExternal>
            <Button colorScheme="blue">Follow me on Twitter</Button>
          </Link>
        </VStack>
      </Section>
    </PageTransition>
  </Box>
);

export default Home;
