import {
  HStack,
  Icon,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeviceMobile, AppleLogo, Compass, Desktop } from "phosphor-react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import sorter from "sort-isostring";

import Hero from "@/components/hero";
import Section from "@/components/section";
import ToolCard from "@/components/tool-card";
import { getTable, type ToolFields, type AirtableRecord } from "@/lib/airtable";
import Layout from "@/layouts/layout";

type ToolsPageProps = {
  tools: AirtableRecord<ToolFields>[];
};

const tabStyles = (isSelected: boolean, lightBg: string, darkBg: string) => ({
  color: useColorModeValue("neutral.900", "neutralD.900"),
  bg: useColorModeValue("neutral.300", "neutralD.300"),
  ...(isSelected
    ? {
        color: useColorModeValue("gray.100", "neutralD.100"),
        bg: useColorModeValue(lightBg, darkBg),
      }
    : {}),
});

const toolsByPlatform = (tools: AirtableRecord<ToolFields>[], platform: string) =>
  tools
    .filter((tool) => tool.fields.Platform === platform)
    .sort((left, right) =>
      sorter(String(right.fields.ID ?? ""), String(left.fields.ID ?? ""))
    );

export default function Tools({
  tools,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <VStack spacing={8}>
        <Hero
          title="Tools"
          subtitle="All the great apps and tools that make my life easier and more fun"
        />
        <Section>
          <Tabs variant="soft-rounded" colorScheme="blue" align="center" w="100%">
            <TabList display="flex" flexWrap="wrap">
              <Tab
                mr={2}
                mt={2}
                bg={useColorModeValue("neutral.300", "neutralD.300")}
                color={useColorModeValue("neutral.900", "neutralD.900")}
                _selected={{
                  color: useColorModeValue("gray.100", "neutralD.100"),
                  bg: useColorModeValue("gray.900", "gray.100"),
                }}
              >
                <HStack spacing={1}>
                  <AppleLogo weight="duotone" size={18} />
                  <Text>Mac</Text>
                </HStack>
              </Tab>
              <Tab
                mr={2}
                mt={2}
                bg={useColorModeValue("neutral.300", "neutralD.300")}
                color={useColorModeValue("neutral.900", "neutralD.900")}
                _selected={{
                  color: useColorModeValue("gray.100", "neutralD.100"),
                  bg: useColorModeValue("gray.900", "gray.100"),
                }}
              >
                <HStack spacing={1}>
                  <DeviceMobile weight="duotone" size={18} />
                  <Text>iOS</Text>
                </HStack>
              </Tab>
              <Tab
                mr={2}
                mt={2}
                bg={useColorModeValue("neutral.300", "neutralD.300")}
                color={useColorModeValue("neutral.900", "neutralD.900")}
                _selected={{
                  color: useColorModeValue("gray.100", "neutralD.100"),
                  bg: useColorModeValue("gray.900", "gray.100"),
                }}
              >
                <HStack spacing={1}>
                  <Compass weight="duotone" size={18} />
                  <Text>Safari</Text>
                </HStack>
              </Tab>
              <Tab
                mr={2}
                mt={2}
                bg={useColorModeValue("neutral.300", "neutralD.300")}
                color={useColorModeValue("neutral.900", "neutralD.900")}
                _selected={{
                  color: useColorModeValue("gray.100", "neutralD.100"),
                  bg: useColorModeValue("gray.900", "gray.100"),
                }}
              >
                <HStack spacing={1}>
                  <Desktop size={18} />
                  <Text>Web</Text>
                </HStack>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                <SimpleGrid columns={[1, 2]} spacing={4} mt={8}>
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
              </TabPanel>
              <TabPanel px={0}>
                <SimpleGrid columns={[1, 2]} spacing={4} mt={8}>
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
              </TabPanel>
              <TabPanel px={0}>
                <SimpleGrid columns={[1, 2]} spacing={4} mt={8}>
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
              </TabPanel>
              <TabPanel px={0}>
                <SimpleGrid columns={[1, 2]} spacing={4} mt={8}>
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
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Section>
      </VStack>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<ToolsPageProps> = async () => {
  const tools = await getTable<ToolFields>("Tools");

  return {
    props: {
      tools,
    },
    revalidate: 10,
  };
};
