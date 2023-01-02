import React from "react";
import fs from "fs";
import {
  VStack,
  Text,
  Heading,
  useColorModeValue,
  SimpleGrid,
  StackDivider,
  Avatar,
  useDisclosure,
  Button,
  Box,
  HStack,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import PageTransition from "../components/page-transitions";
import Section from "@/components/section";
import sorter from "sort-isostring";
import NewsletterDrawer from "@/components/newsletter-modal";
import generateRssIcon from "@/lib/rss";
import { getAllPosts } from "../lib/airtable";
import Hero from "@/components/hero";
import NewsletterModal from "@/components/newsletter-modal";
import BlogListItem from "@/components/blog-list-item";
import SubscribeCard from "@/components/subscribe-card";
import { XIcon } from "@heroicons/react/solid";

export default function Blog({ posts }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <PageTransition>
      <Section>
        <VStack spacing={4}>
          <Hero
            title="Blog"
            subtitle="Helpful tools, thoughtful articles and other findings from the web.
            From my desk to yours."
          />

          <SubscribeCard
            image={false}
            title=""
            description=""
            card={false}
            center
          />
          {isOpen ? (
            <Box w="100%">
              <Box
                border="1px solid"
                borderColor={useColorModeValue("gray.200", "gray.700")}
                w="100%"
                rounded="lg"
                overflow="hidden"
                boxShadow="lg"
                mt={8}
              >
                <Box
                  w="100%"
                  bg={useColorModeValue("gray.50", "neutralD.100")}
                  borderBottom="1px"
                  borderColor="gray.200"
                >
                  <HStack justify={"space-between"} mr={4}>
                    <HStack p={4} fontSize="sm" spacing={4}>
                      <Avatar src="/avatar-small.jpg" h={8} w={8}></Avatar>
                      <VStack spacing={0} alignItems="left">
                        <Text>
                          <Text
                            as="span"
                            color={useColorModeValue("gray.600", "gray.400")}
                            fontWeight="500"
                          >
                            From:
                          </Text>{" "}
                          Daniel Wirtz
                        </Text>
                        <Text>
                          <Text
                            as="span"
                            color={useColorModeValue("gray.600", "gray.400")}
                            fontWeight="500"
                          >
                            To:
                          </Text>{" "}
                          you@email.com
                        </Text>
                      </VStack>
                    </HStack>
                    <IconButton
                      aria-label="Close Preview"
                      onClick={onClose}
                      variant="ghost"
                      icon={<Icon as={XIcon} />}
                    />
                  </HStack>
                </Box>
                <Box h="500px" w="100%" bg="white">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://buttondown.email/fromthedesk/archive/2-digital-christmas-cards-global-shipping-and/?as_embed=true"
                  ></iframe>
                </Box>
              </Box>
            </Box>
          ) : (
            <Button onClick={onOpen} variant="link">
              ... or take a look at a newsletter first
            </Button>
          )}
          {!posts.length && "No posts found."}
          <SimpleGrid columns={1} spacing={4} pt={8} w="100%">
            {posts

              .filter((p) => p.fields.status === "Published")
              .sort((x, y) =>
                sorter(y.fields.publishDate, x.fields.publishDate)
              )
              .map((post) => {
                return <BlogListItem key={post.id} {...post.fields} />;
              })}
          </SimpleGrid>
        </VStack>
      </Section>
    </PageTransition>
  );
}

export async function getStaticProps() {
  const posts = await getAllPosts();

  const rss = await generateRssIcon(posts);

  fs.writeFileSync("./public/rss.xml", rss);

  return {
    props: {
      posts,
    },
    revalidate: 10,
  };
}
