"use client";

import React from "react";
import { Avatar, Button, HStack, Icon, Stack, Text, VStack } from "@chakra-ui/react";
import { CheckIcon, LinkIcon } from "@heroicons/react/20/solid";
import { format } from "timeago.js";

import { useColorModeValue } from "./ui/color-mode";
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
          <Avatar.Image src="/avatar-small.jpg" />
        </Avatar.Root>
        <VStack gap={0} align="start">
          <Text fontSize="md" fontWeight="500">
            Daniel Wirtz
          </Text>
          <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.200")}>
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
              ? useColorModeValue("green.600", "green.200")
              : useColorModeValue("neutralD.100", "gray.100")
          }
          bg={useColorModeValue("white", "neutralD.100")}
        >
          {hasCopied ? (
            <Icon asChild>
              <CheckIcon />
            </Icon>
          ) : (
            <Icon asChild>
              <LinkIcon />
            </Icon>
          )}
          {hasCopied ? "Copied" : "Copy link"}
        </Button>
      </HStack>
    </Stack>
  );
};

export default AuthorCard;
