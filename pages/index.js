import React from "react";
import Head from "next/head";
import { Button, VStack, HStack, Text, IconButton } from "@chakra-ui/react";
import Container from "../components/container";

const Home = () => (
  <PageTransition>
    <Container>
      <VStack align="start">
        <Text fontSize="3xl">Hey, I'm Daniel 👋</Text>
        <Text fontSize="5xl" fontWeight="bold">
          Designer and Co-Founder of . I grew up in Germany and now live in
          Utrecht, the Netherlands.
        </Text>
        <Button colorScheme="blue">Follow me on Twitter</Button>
      </VStack>
    </Container>
  </PageTransition>
);

export default Home;
