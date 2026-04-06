"use client";

import { HStack, SimpleGrid, Tabs, Text, VStack } from "@chakra-ui/react";
import { AppleLogo, Compass, Desktop, DeviceMobile } from "phosphor-react";
import sorter from "sort-isostring";

import Hero from "@/components/hero";
import Section from "@/components/section";
import ToolCard from "@/components/tool-card";
import type { AirtableRecord, ToolFields } from "@/lib/airtable";

type ToolsPageProps = {
  tools: AirtableRecord<ToolFields>[];
};

const toolsByPlatform = (tools: AirtableRecord<ToolFields>[], platform: string) =>
  tools
    .filter((tool) => tool.fields.Platform === platform)
    .sort((left, right) => sorter(String(right.fields.ID ?? ""), String(left.fields.ID ?? "")));

export default function ToolsPage({ tools }: ToolsPageProps) {
  return (
    <VStack gap={8}>
      <Hero
        title="Tools"
        subtitle="All the great apps and tools that make my life easier and more fun"
      />
      <Section>
        <Tabs.Root
          defaultValue="mac"
          variant="subtle"
          colorPalette="blue"
          justifyContent="center"
          size="xl"
          w="100%"
        >
          <Tabs.List display="flex" flexWrap="wrap">
            <Tabs.Trigger value="mac" mr={2} mt={2}>
              <HStack gap={1}>
                <AppleLogo weight="duotone" size={18} />
                <Text>Mac</Text>
              </HStack>
            </Tabs.Trigger>
            <Tabs.Trigger value="ios" mr={2} mt={2}>
              <HStack gap={1}>
                <DeviceMobile weight="duotone" size={18} />
                <Text>iOS</Text>
              </HStack>
            </Tabs.Trigger>
            <Tabs.Trigger value="safari" mr={2} mt={2}>
              <HStack gap={1}>
                <Compass weight="duotone" size={18} />
                <Text>Safari</Text>
              </HStack>
            </Tabs.Trigger>
            <Tabs.Trigger value="web" mr={2} mt={2}>
              <HStack gap={1}>
                <Desktop size={18} />
                <Text>Web</Text>
              </HStack>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="mac" px={0}>
            <SimpleGrid columns={[1, 2]} gap={4} mt={8}>
              {toolsByPlatform(tools, "Mac").map((tool) => (
                <ToolCard
                  key={tool.id}
                  name={tool.fields.Name}
                  description={tool.fields.Description}
                  image={tool.fields.Image}
                  platform={tool.fields.Platform}
                  isAffiliate={tool.fields.Affiliate}
                  link={tool.fields.Link}
                />
              ))}
            </SimpleGrid>
          </Tabs.Content>
          <Tabs.Content value="ios" px={0}>
            <SimpleGrid columns={[1, 2]} gap={4} mt={8}>
              {toolsByPlatform(tools, "Android").map((tool) => (
                <ToolCard
                  key={tool.id}
                  name={tool.fields.Name}
                  description={tool.fields.Description}
                  image={tool.fields.Image}
                  platform={tool.fields.Platform}
                  isAffiliate={tool.fields.Affiliate}
                  link={tool.fields.Link}
                />
              ))}
            </SimpleGrid>
          </Tabs.Content>
          <Tabs.Content value="safari" px={0}>
            <SimpleGrid columns={[1, 2]} gap={4} mt={8}>
              {toolsByPlatform(tools, "Chrome").map((tool) => (
                <ToolCard
                  key={tool.id}
                  name={tool.fields.Name}
                  description={tool.fields.Description}
                  image={tool.fields.Image}
                  platform={tool.fields.Platform}
                  isAffiliate={tool.fields.Affiliate}
                  link={tool.fields.Link}
                />
              ))}
            </SimpleGrid>
          </Tabs.Content>
          <Tabs.Content value="web" px={0}>
            <SimpleGrid columns={[1, 2]} gap={4} mt={8}>
              {toolsByPlatform(tools, "Web").map((tool) => (
                <ToolCard
                  key={tool.id}
                  name={tool.fields.Name}
                  description={tool.fields.Description}
                  image={tool.fields.Image}
                  platform={tool.fields.Platform}
                  isAffiliate={tool.fields.Affiliate}
                  link={tool.fields.Link}
                />
              ))}
            </SimpleGrid>
          </Tabs.Content>
        </Tabs.Root>
      </Section>
    </VStack>
  );
}
