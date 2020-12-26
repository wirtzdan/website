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
import { TwitterLogo } from "phosphor-react";

const Home = () => (
  <Box flexGrow="1">
    <PageTransition>
      <Section py={16} pb={{ base: 32, md: 16 }}>
        <VStack spacing={2} align={["start", "center"]}>
          <Text fontSize="3xl">Hey, I'm Daniel 👋</Text>
          <Text
            fontSize={["3xl", "4xl"]}
            fontWeight="500"
            lineHeight={1.25}
            textAlign={["left", "center"]}
            mb={4}
          >
            I'm a designer, developer and maker of things. Born in Germany and
            now living in Utrecht, Netherlands.
          </Text>
          <Link href="https://twitter.com/wirtzdan" isExternal>
            <Button
              colorScheme="blue"
              size="lg"
              rounded="xl"
              leftIcon={<TwitterLogo weight="fill" />}
            >
              Twitter
            </Button>
          </Link>
        </VStack>
      </Section>
    </PageTransition>
  </Box>
);

export default Home;
