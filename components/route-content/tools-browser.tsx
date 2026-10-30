"use client";

import { HStack, SimpleGrid, Tabs, Text, VStack } from "@chakra-ui/react";
import { AppleLogo, Compass, Desktop, DeviceMobile } from "phosphor-react";
import sorter from "sort-isostring";

import EmptyState from "@/components/empty-state";
import Hero from "@/components/hero";
import Section from "@/components/section";
import ToolCard from "@/components/tool-card";
import type { AirtableRecord, ToolFields } from "@/lib/airtable";
import { TOOL_PLATFORM_TABS, toolsForPlatformTab } from "@/lib/tool-platforms";
import { toolIconUrl } from "@/lib/tool-icon";
import { toolEmptyCopy } from "@/lib/ui-copy";

type ToolsBrowserProps = {
  tools: AirtableRecord<ToolFields>[];
  tints: Record<string, string>;
};

const platformIcons = {
  Mac: AppleLogo,
  iOS: DeviceMobile,
  Safari: Compass,
  Web: Desktop,
} as const;

const toolsByPlatform = (tools: AirtableRecord<ToolFields>[], platform: string) =>
  toolsForPlatformTab(tools, platform).sort((left, right) =>
    sorter(String(right.fields.ID ?? ""), String(left.fields.ID ?? "")),
  );

export default function ToolsBrowser({ tools, tints }: ToolsBrowserProps) {
  const tabBg = { _light: "neutral.300", _dark: "neutralD.300" };
  const tabColor = { _light: "neutral.1100", _dark: "neutralD.1000" };
  const tabSelected = {
    color: { _light: "neutral.50", _dark: "neutralD.100" },
    bg: { _light: "neutral.1100", _dark: "neutralD.1100" },
  };

  return (
    <VStack gap={8}>
      <Hero
        title="Tools"
        subtitle="All the great apps and tools that make my life easier and more fun"
      />
      <Section>
        <Tabs.Root
          defaultValue="Mac"
          variant="subtle"
          colorPalette="blue"
          w="100%"
          lazyMount
          unmountOnExit
        >
          <Tabs.List display="flex" flexWrap="wrap" justifyContent="center">
            {TOOL_PLATFORM_TABS.map((tab) => {
              const Icon = platformIcons[tab.id];
              return (
                <Tabs.Trigger
                  key={tab.id}
                  value={tab.id}
                  mr={2}
                  mt={2}
                  bg={tabBg}
                  color={tabColor}
                  _selected={tabSelected}
                >
                  <HStack gap={1}>
                    <Icon weight="duotone" size={18} />
                    <Text>{tab.label}</Text>
                  </HStack>
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>
          {TOOL_PLATFORM_TABS.map((tab) => {
            const platformTools = toolsByPlatform(tools, tab.id);
            const empty = toolEmptyCopy[tab.id];

            return (
              <Tabs.Content key={tab.id} value={tab.id} px={0}>
                {platformTools.length === 0 ? (
                  <EmptyState
                    mt={8}
                    minH="24"
                    title={empty.title}
                    description={empty.description}
                  />
                ) : (
                  <SimpleGrid columns={[1, 2]} gap={4} mt={8}>
                    {platformTools.map((tool) => {
                      const imageUrl = toolIconUrl(tool.fields.Image);
                      return (
                        <ToolCard
                          key={tool.id}
                          name={tool.fields.Name}
                          description={tool.fields.Description}
                          image={tool.fields.Image}
                          platform={tool.fields.Platform}
                          isAffiliate={tool.fields.Affiliate}
                          link={tool.fields.Link}
                          tint={imageUrl ? tints[imageUrl] : undefined}
                        />
                      );
                    })}
                  </SimpleGrid>
                )}
              </Tabs.Content>
            );
          })}
        </Tabs.Root>
      </Section>
    </VStack>
  );
}
