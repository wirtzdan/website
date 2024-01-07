import React from "react";
import {
  chakra,
  Icon,
  VStack,
  HStack,
  Text,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  SimpleGrid,
  Box,
  Wrap,
} from "@chakra-ui/react";
import PageTransition from "../components/page-transitions";
import { getTable } from "@/lib/airtable";
import Section from "@/components/section";
import BookCard from "@/components/book-card";

import BookSuggestion from "@/components/book-suggestion";
import {
  BookOpenIcon,
  DesktopComputer,
  HeartIcon,
} from "@heroicons/react/24/solid";
import sorter from "sort-isostring";
import {
  AndroidLogo,
  AppleLogo,
  Globe,
  Monitor,
  DeviceMobile,
  Compass,
  Desktop,
} from "phosphor-react";
import ToolCard from "../components/tool-card";
import { Chrome } from "react-feather";
import Hero from "@/components/hero";

const Tools = ({ tools }) => {
  return (
    <PageTransition>
      <VStack spacing={8}>
        <Hero
          title="Tools"
          subtitle="All the great apps and tools that make my life easier and more fun"
        />
        <Section>
          <Tabs
            variant="soft-rounded"
            colorScheme="blue"
            align="center"
            w="100%"
          >
            <TabList display="flex" flexWrap="wrap">
              <Tab
                bg={useColorModeValue("neutral.300", "neutralD.300")}
                color={useColorModeValue("neutral.900", "neutralD.900")}
                _selected={{
                  color: useColorModeValue("gray.100", "neutralD.100"),
                  bg: useColorModeValue("gray.900", "gray.100"),
                }}
                mr={2}
                mt={2}
              >
                <HStack spacing={1}>
                  <Icon as={AppleLogo} weight="duotone" />
                  <Text>Mac</Text>
                </HStack>
              </Tab>
              <Tab
                bg={useColorModeValue("neutral.300", "neutralD.300")}
                color={useColorModeValue("neutral.900", "neutralD.900")}
                _selected={{
                  color: useColorModeValue("gray.100", "neutralD.100"),
                  bg: useColorModeValue("gray.900", "gray.100"),
                }}
                mr={2}
                mt={2}
              >
                <HStack spacing={1}>
                  <Icon as={DeviceMobile} weight="duotone" />
                  <Text>iOS</Text>
                </HStack>
              </Tab>
              <Tab
                bg={useColorModeValue("neutral.300", "neutralD.300")}
                color={useColorModeValue("neutral.900", "neutralD.900")}
                _selected={{
                  color: useColorModeValue("gray.100", "neutralD.100"),
                  bg: useColorModeValue("gray.900", "gray.100"),
                }}
                mr={2}
                mt={2}
                s
              >
                <HStack spacing={1}>
                  <Icon as={Compass} weight="duotone" />
                  <Text>Safari</Text>
                </HStack>
              </Tab>
              <Tab
                bg={useColorModeValue("neutral.300", "neutralD.300")}
                color={useColorModeValue("neutral.900", "neutralD.900")}
                _selected={{
                  color: useColorModeValue("gray.100", "neutralD.100"),
                  bg: useColorModeValue("gray.900", "gray.100"),
                }}
                mr={2}
                mt={2}
              >
                <HStack spacing={1}>
                  <Icon as={Desktop} />
                  <Text>Web</Text>
                </HStack>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                <SimpleGrid columns={[1, 2]} spacing={4} mt={8}>
                  {tools
                    .filter((t) => t.fields.Platform === "Mac")
                    .sort((x, y) => sorter(y.fields.ID, x.fields.ID))
                    .map((tool) => (
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
                  {tools
                    .filter((t) => t.fields.Platform === "Android")
                    .sort((x, y) => sorter(y.fields.ID, x.fields.ID))
                    .map((tool) => (
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
                  {tools
                    .filter((t) => t.fields.Platform === "Chrome")
                    .sort((x, y) => sorter(y.fields.ID, x.fields.ID))
                    .map((tool) => (
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
                  {tools
                    .filter((t) => t.fields.Platform === "Web")
                    .sort((x, y) => sorter(y.fields.ID, x.fields.ID))
                    .map((tool) => (
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
    </PageTransition>
  );
};

export async function getStaticProps() {
  const tools = await getTable("Tools");

  return {
    props: {
      tools,
    },
    revalidate: 10,
  };
}

export default Tools;
