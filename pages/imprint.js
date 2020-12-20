import React from "react";
import Head from "next/head";
import { Button, VStack, HStack, Text, IconButton } from "@chakra-ui/react";
import Container from "../components/container";
import PageTransition from "../components/page-transitions";

const Imprint = () => (
  <PageTransition>
    <Container>
      <VStack align="start">
        <Text fontSize="3xl">Imprint 👋</Text>
      </VStack>
    </Container>
  </PageTransition>
);

export default Imprint;
