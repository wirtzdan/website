"use client";

import { useDisclosure } from "@/lib/use-disclosure";
import { Avatar, Box, Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";

import Section from "@/components/section";
import SubscribeCard from "@/components/subscribe-card";
import type { AirtableRecord, NewsletterFields } from "@/lib/airtable";

type NewsletterPageProps = {
  posts: AirtableRecord<NewsletterFields>[];
};

// The archive list is gone (its /archive links 404), so `posts` is unused for now.
export default function NewsletterPage(_props: NewsletterPageProps) {
  const { open, onOpen } = useDisclosure();

  return (
    <Section>
      <VStack gap={16}>
        <VStack gap={4}>
          <Heading as="h1">Newsletter</Heading>
          <Text
            fontSize="2xl"
            color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}
            maxW="lg"
            textAlign="center"
          >
            Helpful tools, thoughtful articles and other findings from the web. From my desk to
            yours.
          </Text>
          <SubscribeCard image={false} title="" description="" card={false} center />
          {open ? (
            <Box w="100%">
              <Box
                border="1px solid"
                borderColor={{ _light: "neutral.400", _dark: "neutralD.400" }}
                w="100%"
                rounded="lg"
                overflow="hidden"
                boxShadow="lg"
                mt={8}
              >
                <Box
                  w="100%"
                  bg={{ _light: "neutral.50", _dark: "neutralD.100" }}
                  borderBottom="1px"
                  borderColor={{ _light: "neutral.400", _dark: "neutralD.400" }}
                >
                  <HStack p={4} fontSize="sm" gap={4}>
                    <Avatar.Root h={8} w={8}>
                      <Avatar.Fallback />
                      <Avatar.Image alt="" src="/avatar-small.jpg" />
                    </Avatar.Root>
                    <VStack gap={0} alignItems="flex-start">
                      <Text>
                        <Text
                          as="span"
                          color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}
                          fontWeight="500"
                        >
                          From:
                        </Text>{" "}
                        Daniel Wirtz
                      </Text>
                      <Text>
                        <Text
                          as="span"
                          color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}
                          fontWeight="500"
                        >
                          To:
                        </Text>{" "}
                        you@email.com
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
                <Box h="500px" w="100%" bg={{ _light: "white", _dark: "neutralD.100" }}>
                  <iframe
                    width="100%"
                    height="100%"
                    title="Newsletter preview"
                    src="https://buttondown.email/danielwirtz/archive/2-digital-christmas-cards-global-shipping-and/?as_embed=true"
                  />
                </Box>
              </Box>
            </Box>
          ) : (
            <Button onClick={onOpen} variant="plain">
              …or see how it looks first
            </Button>
          )}
        </VStack>
      </VStack>
    </Section>
  );
}
