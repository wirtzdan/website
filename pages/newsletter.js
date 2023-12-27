import React from "react";
import {
  VStack,
  Text,
  Heading,
  useColorModeValue,
  HStack,
  Button,
  useDisclosure,
  Box,
  Avatar,
  Stack,
} from "@chakra-ui/react";
import PageTransition from "../components/page-transitions";
import Section from "@/components/section";
import sorter from "sort-isostring";
import { getAllNewsletters } from "../lib/airtable";
import Link from "@/components/link";
import SubscribeCard from "@/components/subscribe-card";

export default function Newsletter({ posts }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <PageTransition>
      <Section>
        <VStack spacing={16}>
          <VStack spacing={4}>
            <Heading as="h1">Newsletter</Heading>
            <Text
              fontSize="2xl"
              color={useColorModeValue("gray.500", "gray.200")}
              maxW="lg"
              textAlign="center"
            >
              Helpful tools, thoughtful articles and other findings from the
              web. From my desk to yours.
            </Text>
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
                ... or see how it looks first
              </Button>
            )}
          </VStack>

          {/* {!posts.length && "No posts found."} */}
          <VStack w="full" spacing={8}>
            <Heading as="h2" size="md">
              Read past newsletters
            </Heading>
            <VStack alignItems="flex-start" spacing={4} w="full">
              {posts
                .filter((p) => p.fields.Status === "Published")
                .sort((x, y) =>
                  sorter(y.fields["Published on"], x.fields["Published on"])
                )
                .map((post) => {
                  return (
                    <Stack
                      key={post.id}
                      direction={["column", "row"]}
                      justify="space-between"
                      align="flex-start"
                      w="full"
                    >
                      <Link href={`/archive/${post.fields.Slug}`} unstyled>
                        <HStack>
                          <Text
                            display={["none", "block"]}
                            fontSize="md"
                            color={useColorModeValue(
                              "neutral.800",
                              "neutralD.800"
                            )}
                          >
                            {post.fields.Issue.toString().padStart(2, "0")}
                          </Text>
                          <Text
                            _hover={{ textDecoration: "underline" }}
                            fontSize="md"
                          >
                            {post.fields.Subject}
                          </Text>
                        </HStack>
                      </Link>
                      <Text
                        display={["none", "block"]}
                        color={useColorModeValue("neutral.800", "neutralD.800")}
                        fontSize="md"
                      >
                        {
                          new Date(post.fields["Published on"])
                            .toISOString()
                            .split("T")[0]
                        }
                      </Text>
                    </Stack>
                  );
                })}
            </VStack>
          </VStack>
        </VStack>
      </Section>
    </PageTransition>
  );
}

export async function getStaticProps() {
  const posts = await getAllNewsletters();

  return {
    props: {
      posts,
    },
    revalidate: 10,
  };
}
