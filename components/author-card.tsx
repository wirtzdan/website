"use client";

import React from "react";
import { useClipboard } from "@/lib/use-clipboard";
import { Avatar, Button, HStack, Icon, Stack, Text, VStack } from "@chakra-ui/react";
import { format } from "timeago.js";
import { RiCheckFill, RiLink } from "@remixicon/react";

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
          <Avatar.Image src="/avatar-small.jpg" />
        </Avatar.Root>
        <VStack gap={0} align="start">
          <Text fontSize="md" fontWeight="500">
            Daniel Wirtz
          </Text>
          <Text fontSize="sm" color="fg.subtle">
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
          colorPalette={hasCopied ? "green" : "gray"}
        >
          {hasCopied ? (
            <Icon asChild>
              <RiCheckFill />
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
