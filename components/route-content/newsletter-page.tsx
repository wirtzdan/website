"use client";
import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import sorter from "sort-isostring";

import Link from "@/components/link";
import SubscribeCard from "@/components/subscribe-card";
import type { AirtableRecord, NewsletterFields } from "@/lib/airtable";
import Section from "@/components/section";

type NewsletterPageProps = {
  posts: AirtableRecord<NewsletterFields>[];
};

export default function NewsletterPage({ posts }: NewsletterPageProps) {
  const { open, onOpen } = useDisclosure();

  return (
    <Section>
      <VStack gap={16}>
        <VStack gap={4}>
          <Heading as="h1">Newsletter</Heading>
          <Text fontSize="2xl" color="fg.subtle" maxW="lg" textAlign="center">
            Helpful tools, thoughtful articles and other findings from the web. From my desk to
            yours.
          </Text>
          <SubscribeCard image={false} title="" description="" card={false} center />
          {open ? (
            <Box w="100%">
              <Box
                border="1px solid"
                borderColor="border.emphasized"
                w="100%"
                rounded="lg"
                overflow="hidden"
                boxShadow="lg"
                mt={8}
              >
                <Box w="100%" bg="bg.muted" borderBottom="1px" borderColor="border">
                  <HStack p={4} fontSize="sm" gap={4}>
                    <Avatar.Root h={8} w={8}>
                      <Avatar.Fallback />
                      <Avatar.Image src="/avatar-small.jpg" />
                    </Avatar.Root>
                    <VStack gap={0} alignItems="flex-start">
                      <Text>
                        <Text as="span" color="fg.muted" fontWeight="500">
                          From:
                        </Text>{" "}
                        Daniel Wirtz
                      </Text>
                      <Text>
                        <Text as="span" color="fg.muted" fontWeight="500">
                          To:
                        </Text>{" "}
                        you@email.com
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
                <Box h="500px" w="100%" bg="bg.panel">
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
              ... or see how it looks first
            </Button>
          )}
        </VStack>

        <VStack w="full" gap={8}>
          <Heading as="h2" size="md">
            Read past newsletters
          </Heading>
          <VStack alignItems="flex-start" gap={4} w="full">
            {posts
              .filter((post) => post.fields.Status === "Published")
              .sort((left, right) =>
                sorter(right.fields["Published on"] ?? "", left.fields["Published on"] ?? ""),
              )
              .map((post) => (
                <Stack
                  key={post.id}
                  direction={["column", "row"]}
                  justify="space-between"
                  align="flex-start"
                  w="full"
                >
                  <Link href={`/archive/${post.fields.Slug ?? ""}`} unstyled>
                    <HStack>
                      <Text display={["none", "block"]} fontSize="md" color="fg.muted">
                        {(post.fields.Issue ?? 0).toString().padStart(2, "0")}
                      </Text>
                      <Text _hover={{ textDecoration: "underline" }} fontSize="md">
                        {post.fields.Subject}
                      </Text>
                    </HStack>
                  </Link>
                  <Text display={["none", "block"]} color="fg.muted" fontSize="md">
                    {post.fields["Published on"]
                      ? new Date(post.fields["Published on"]).toISOString().split("T")[0]
                      : ""}
                  </Text>
                </Stack>
              ))}
          </VStack>
        </VStack>
      </VStack>
    </Section>
  );
}
