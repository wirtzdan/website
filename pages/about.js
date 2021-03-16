import React from "react";
import Head from "next/head";
import {
  Button,
  VStack,
  HStack,
  Text,
  IconButton,
  Heading,
  Wrap,
} from "@chakra-ui/react";
import PageTransition from "../components/page-transitions";
import Section from "@/components/section";
import interests from "../data/interests.json";
import InterestTag from "@/components/interest-tag";

const About = () => (
  <PageTransition>
    <VStack spacing={8}>
      <Section>
        <VStack align="start">
          <Heading as="h1">About</Heading>
          <Text>
            After school, I studied Media and Communications for Digital
            Business in Aachen, Germany. It was at that time, where I found my
            passion for Design, Technology and being an Entrepreneur. In my free
            time, I always liked to follow my curiosity, learn new things and
            explore the far corners of the internet. In my evenings I like to
            read books, write articles, code things, play tennis, cook and spend
            time with my favorite people in life.
          </Text>
        </VStack>
      </Section>
      <Section>
        <VStack align="stretch" spacing={4}>
          <Heading as="h3" size="lg">
            Work
          </Heading>
          <Text>
            Two semesters into university I co-founded a company called{" "}
            <a href="https://crisp.studio/">Crisp Studio</a> with my good friend
            <a href="https://www.linkedin.com/in/renenauheimer/">
              {" "}
              René Nauheimer
            </a>
            . Over time, the company evolved into a small, specialised studio
            that helps organisations to solve important challenges with Sprints
            and Workshops. In my role, I'm focused on strategy, healthy growth
            and charming clients (I try my best). The journey of building this
            company from the ground up has been one of the most satisfying
            experiences in my life. Head over to my{" "}
            <a href="https://www.linkedin.com/in/wirtzdan/"> LinkedIn</a>, if
            you want to connect with my professionally.
          </Text>
        </VStack>
      </Section>
      <Section>
        <VStack align="stretch" spacing={4}>
          <Heading as="h2">😁</Heading>
          <Wrap>
            {interests.like.map((el) => (
              <InterestTag name={el} like />
            ))}
          </Wrap>
        </VStack>
      </Section>
      <Section>
        <VStack align="stretch" spacing={4}>
          <Heading as="h2">😒</Heading>
          <Wrap>
            {interests.dislike.map((el) => (
              <InterestTag name={el} />
            ))}
          </Wrap>
        </VStack>
      </Section>
    </VStack>
  </PageTransition>
);

export default About;
