import React from "react";
import Head from "next/head";
import {
  Button,
  VStack,
  HStack,
  Text,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import PageTransition from "../components/page-transitions";
import Section from "@/components/section";

const About = () => (
  <PageTransition>
    <Section py={16}>
      <VStack align="start">
        <Heading as="h1">About</Heading>
        <Text>
          After school, I studied Media and Communications for Digital Business
          in Aachen, Germany. It was at that time, where I found my passion for
          Design, Technology and being an Entrepreneur. In my free time, I
          always liked to follow my curiosity, learn new things and explore the
          far corners of the internet. Currently, I'm spending my day on while
          dedicating my evenings read books, write articles, code things and
          spend time with my favorite people in life.
        </Text>
        <Heading as="h2" size="lg">
          Work
        </Heading>
        <Text>
          After school, I studied Media and Communications for Digital Business
          in Aachen, Germany. It was at that time, where I found my passion for
          Design, Technology and being an Entrepreneur. In my free time, I
          always liked to follow my curiosity, learn new things and explore the
          far corners of the internet. Currently, I'm spending my day on while
          dedicating my evenings read books, write articles, code things and
          spend time with my favorite people in life.
        </Text>
      </VStack>
    </Section>
  </PageTransition>
);

export default About;
