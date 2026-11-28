"use client";

import { SimpleGrid, Text, VStack } from "@chakra-ui/react";

import Hero from "@/components/hero";
import StudioProjectCard from "@/components/studio-project-card";
import Section from "@/components/section";
import { PROJECTS } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <>
      <Hero title="Projects" align="start" />
      <VStack gap={12} mt={6}>
        <Section>
          <VStack align="start" gap={8} w="100%">
            <Text fontSize={["lg", "2xl"]}>
              I build small apps in my own time, next to my work at Giving What We Can. Here is what
              is live today.
            </Text>
            <SimpleGrid columns={1} gap={4} w="100%">
              {PROJECTS.map((project) => (
                <StudioProjectCard key={project.name} project={project} />
              ))}
            </SimpleGrid>
            <Text color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}>
              I will add more here as new things ship.
            </Text>
          </VStack>
        </Section>
      </VStack>
    </>
  );
}
