"use client";

import React from "react";
import { Box, Button, HStack, Icon, Text } from "@chakra-ui/react";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { getBlockTitle } from "notion-utils";
import { useNotionContext } from "react-notion-x";

import { useClipboard } from "@/lib/use-clipboard";
import Highlight from "./highlight";

interface CodeblockProps {
  block: {
    properties?: {
      language?: Array<[string]>;
      caption?: Array<[string]>;
    };
  };
  defaultLanguage?: string;
  ln?: string;
}

const Codeblock = ({ block, defaultLanguage = "typescript", ln }: CodeblockProps) => {
  const { recordMap } = useNotionContext();
  const editorCode = getBlockTitle(
    block as unknown as Parameters<typeof getBlockTitle>[0],
    recordMap as unknown as Parameters<typeof getBlockTitle>[1],
  );
  const language = (block.properties?.language?.[0]?.[0] ?? defaultLanguage).toLowerCase();
  const { hasCopied, onCopy } = useClipboard(editorCode);
  const title = block.properties?.caption?.[0]?.[0];

  return (
    <Box
      rounded="md"
      overflow="hidden"
      bg={{ _light: "white", _dark: "neutralD.100" }}
      my={4}
      borderWidth="1px"
      borderColor={{ _light: "neutral.400", _dark: "neutralD.400" }}
      w="100%"
    >
      {title ? (
        <HStack
          px={5}
          py={1}
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth="1px"
          borderBottomColor={{ _light: "neutral.400", _dark: "neutralD.400" }}
        >
          <Text
            fontSize="sm"
            fontWeight="500"
            color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}
          >
            {title}
          </Text>
          <Button
            size="sm"
            onClick={onCopy}
            variant="ghost"
            color={
              hasCopied
                ? { _light: "green.600", _dark: "green.100" }
                : { _light: "neutral.1000", _dark: "neutralD.1000" }
            }
            bg={hasCopied ? { _light: "green.50", _dark: "green.800" } : undefined}
          >
            {hasCopied ? (
              <Icon boxSize={4.5} asChild>
                <CheckIcon />
              </Icon>
            ) : (
              <Icon boxSize={4.5} asChild>
                <DocumentDuplicateIcon />
              </Icon>
            )}
            {hasCopied ? "Copied" : "Copy"}
          </Button>
        </HStack>
      ) : null}
      <Highlight codeString={editorCode} language={language} showLines={false} ln={ln} />
    </Box>
  );
};

export default Codeblock;
