"use client";

import { HStack, SimpleGrid, Tabs, Text, VStack } from "@chakra-ui/react";
import { AppleLogo, Compass, Desktop, DeviceMobile } from "phosphor-react";
import sorter from "sort-isostring";

import Hero from "@/components/hero";
import Section from "@/components/section";
import ToolCard from "@/components/tool-card";
import { useColorModeValue } from "@/components/ui/color-mode";
import type { AirtableRecord, ToolFields } from "@/lib/airtable";

type ToolsPageProps = {
  tools: AirtableRecord<ToolFields>[];
};

const platforms = [
  { value: "Mac", label: "Mac", icon: AppleLogo },
  { value: "iOS", label: "iOS", icon: DeviceMobile },
  { value: "Safari", label: "Safari", icon: Compass },
  { value: "Web", label: "Web", icon: Desktop },
] as const;

const toolsByPlatform = (tools: AirtableRecord<ToolFields>[], platform: string) =>
  tools
    .filter((tool) => tool.fields.Platform === platform)
    .sort((left, right) => sorter(String(right.fields.ID ?? ""), String(left.fields.ID ?? "")));

export default function ToolsPage({ tools }: ToolsPageProps) {
  const tabBg = useColorModeValue("neutral.300", "neutralD.300");
  const tabColor = useColorModeValue("neutral.900", "neutralD.900");
  const tabSelected = {
    color: useColorModeValue("gray.100", "neutralD.100"),
    bg: useColorModeValue("gray.900", "gray.100"),
  };

  return (
    <VStack gap={8}>
      <Hero
        title="Tools"
        subtitle="All the great apps and tools that make my life easier and more fun"
      />
      <Section>
        <Tabs.Root defaultValue="Mac" variant="subtle" colorPalette="blue" w="100%">
          <Tabs.List display="flex" flexWrap="wrap" justifyContent="center">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <Tabs.Trigger
                  key={platform.value}
                  value={platform.value}
                  mr={2}
                  mt={2}
                  bg={tabBg}
                  color={tabColor}
                  _selected={tabSelected}
                >
                  <HStack gap={1}>
                    <Icon weight="duotone" size={18} />
                    <Text>{platform.label}</Text>
                  </HStack>
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>
          {platforms.map((platform) => (
            <Tabs.Content key={platform.value} value={platform.value} px={0}>
              <SimpleGrid columns={[1, 2]} gap={4} mt={8}>
                {toolsByPlatform(tools, platform.value).map((tool) => (
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
          ))}
        </Tabs.Root>
      </Section>
    </VStack>
  );
}
