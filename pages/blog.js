import React from "react";
import Head from "next/head";
import {
  Button,
  VStack,
  HStack,
  Text,
  IconButton,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import Container from "../components/container";
import PageTransition from "../components/page-transitions";
import Section from "@/components/section";

const Blog = () => (
  <PageTransition>
    <Section py={16}>
      <VStack align="start" spacing={8}>
        <VStack align="start">
          <Heading as="h1">Blog</Heading>
          <Text
            fontSize="2xl"
            color={useColorModeValue("gray.500", "gray.200")}
            maxW="md"
          >
            Welcome to my blog. Here I share some of my thinking, insights and
            views on life.
          </Text>
        </VStack>
        <VStack
          align="start"
          p={4}
          bg={useColorModeValue("white", "gray.800")}
          rounded="md"
          shadow="xs"
          w="100%"
        >
          <Text
            color={useColorModeValue("blue.500", "blue.200")}
            fontWeight="bold"
            fontSize="xl"
          >
            What I learned after 50 days of meditation
          </Text>
          <Text
            fontSize="lg"
            maxW="md"
            color={useColorModeValue("gray.500", "gray.200")}
          >
            Learnings and observations after meditating for 50 days with the
            Waking Up app
          </Text>
        </VStack>
      </VStack>
    </Section>
  </PageTransition>
);

export default Blog;
