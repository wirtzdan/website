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
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import Container from "../components/container";
import PageTransition from "../components/page-transitions";
import Section from "@/components/section";
import { TwitterLogo } from "phosphor-react";
import ProjectCard from "@/components/project-card";
import { getTable } from "@/lib/airtable";

const Home = ({ projects }) => (
  <Box>
    <PageTransition>
      <VStack spacing={12}>
        <Section>
          <VStack spacing={4} align="start" fontSize="2xl">
            <Heading size="xl">Hey, I'm Daniel 👋</Heading>
            <VStack>
              <Text>
                I'm a designer, developer and entrepreneur of sorts. Born and
                raised in Germany and now living in the Netherlands.
              </Text>
              <Text>
                By day, I'm helping managers and creatives to run better digital
                workshops with the{" "}
                <Link
                  variant="text"
                  href="https://www.facilitator.school"
                  isExternal
                >
                  Facilitator School
                </Link>
                . We are also working on a{" "}
                <Link
                  variant="text"
                  href="https://www.facilitator.school/masterclass"
                  isExternal
                >
                  transformatial online course
                </Link>
                .
              </Text>
              <Text>
                In my spare time, I work on small web apps and{" "}
                <Link
                  variant="text"
                  href="https://chrome.google.com/webstore/detail/roam-highlighter/hponfflfgcjikmehlcdcnpapicnljkkc?hl=en"
                  isExternal
                >
                  browser extensions
                </Link>{" "}
                that make life easier for other people. I also hang out on{" "}
                <Link
                  variant="text"
                  href="https://twitter.com/wirtzdan"
                  isExternal
                >
                  Twitter
                </Link>
                , where I learn, think and work in public.
              </Text>
            </VStack>
            <Link href="https://twitter.com/wirtzdan" isExternal>
              <Button
                colorScheme="blue"
                rounded="xl"
                size="lg"
                leftIcon={<TwitterLogo weight="fill" />}
                mt={4}
              >
                Follow me on Twitter
              </Button>
            </Link>
          </VStack>
        </Section>
        <Section>
          <VStack align="start" spacing={8}>
            <Heading size="lg">Projects</Heading>

            <SimpleGrid columns={1} spacing={4} mt={8} w="100%">
              {projects.map((projects) => (
                <ProjectCard
                  key={projects.id}
                  name={projects.fields.name}
                  description={projects.fields.description}
                  logo={projects.fields.logo}
                  link={projects.fields.link}
                  type={projects.fields.type}
                />
              ))}
            </SimpleGrid>
          </VStack>
        </Section>
      </VStack>
    </PageTransition>
  </Box>
);

export async function getStaticProps() {
  const projects = await getTable("Projects");
  console.log(
    "🚀 ~ file: index.js ~ line 74 ~ getStaticProps ~ projects",
    projects
  );

  return {
    props: {
      projects,
    },
    revalidate: 600,
  };
}

export default Home;
