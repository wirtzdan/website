"use client";

import React from "react";
import { useClipboard } from "@/lib/use-clipboard";
import { Box, Button, HStack, Icon, Text } from "@chakra-ui/react";
import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import { getBlockTitle } from "notion-utils";
import { useNotionContext } from "react-notion-x";

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
      bg="bg.panel"
      my={4}
      borderWidth="1px"
      borderColor="border"
      w="100%"
    >
      {title ? (
        <HStack
          px={5}
          py={1}
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth="1px"
          borderBottomColor="border"
        >
          <Text fontSize="sm" fontWeight="500" color="fg.muted">
            {title}
          </Text>
          <Button
            size="sm"
            onClick={onCopy}
            variant="ghost"
            colorPalette={hasCopied ? "green" : "gray"}
          >
            {hasCopied ? (
              <Icon boxSize={4.5} asChild>
                <RiCheckLine />
              </Icon>
            ) : (
              <Icon boxSize={4.5} asChild>
                <RiFileCopyLine />
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
