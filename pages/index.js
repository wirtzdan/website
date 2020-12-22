import React from "react";
import Head from "next/head";
import {
  Button,
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
} from "@chakra-ui/react";
import Container from "../components/container";
import PageTransition from "../components/page-transitions";
import Section from "@/components/section";
console.log(
  "🚀 ~ file: index.js ~ line 15 ~ process.env.AIRTABLE_API_KEY",
  process.env.AIRTABLE_API_KEY
);

const Home = () => (
  <Box flexGrow="1">
    <PageTransition>
      <Section py={16}>
        <VStack align="start" spacing={4}>
          <Text fontSize="2xl">Hey, I'm Daniel 👋</Text>
          <Text fontSize="4xl" fontWeight="bold" lineHeight={1.25}>
            Designer and Co-Founder of Crisp Studio. I grew up in Germany and
            now live in Utrecht, the Netherlands.
          </Text>
          <Button colorScheme="blue">Follow me on Twitter</Button>
        </VStack>
      </Section>
    </PageTransition>
  </Box>
);

export default Home;
