"use client";

import React from "react";
import { Avatar, Button, HStack, Icon, Stack, Text, VStack } from "@chakra-ui/react";
import { RiCheckLine, RiLink } from "@remixicon/react";
import { format } from "timeago.js";

import { useClipboard } from "@/lib/use-clipboard";

interface AuthorCardProps {
  readingTime?: string;
  publishedAt: string;
  url: string;
}

const AuthorCard = ({ readingTime = "", publishedAt, url }: AuthorCardProps) => {
  const { hasCopied, onCopy } = useClipboard(url);

  return (
    <Stack direction="row" justify="space-between">
      <HStack>
        <Avatar.Root h={10} w={10}>
          <Avatar.Fallback />
          <Avatar.Image alt="" src="/avatar-small.jpg" />
        </Avatar.Root>
        <VStack gap={0} align="start">
          <Text fontSize="md" fontWeight="500">
            Daniel Wirtz
          </Text>
          <Text fontSize="sm" color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}>
            {format(publishedAt)}
            {readingTime ? ` • ${readingTime}` : ""}
          </Text>
        </VStack>
      </HStack>
      <HStack>
        <Button
          onClick={onCopy}
          ml={2}
          variant="outline"
          size="sm"
          color={
            hasCopied
              ? { _light: "green.600", _dark: "green.200" }
              : { _light: "neutralD.100", _dark: "neutralD.1100" }
          }
          bg={{ _light: "white", _dark: "neutralD.100" }}
        >
          {hasCopied ? (
            <Icon asChild>
              <RiCheckLine />
            </Icon>
          ) : (
            <Icon asChild>
              <RiLink />
            </Icon>
          )}
          {hasCopied ? "Copied" : "Copy link"}
        </Button>
      </HStack>
    </Stack>
  );
};

export default AuthorCard;
