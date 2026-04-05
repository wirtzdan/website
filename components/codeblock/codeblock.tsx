import React from "react";
import { Box, Button, HStack, Icon, Text, useClipboard, useColorModeValue } from "@chakra-ui/react";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
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
      bg={useColorModeValue("white", "neutralD.100")}
      my={4}
      borderWidth="1px"
      borderColor={useColorModeValue("neutral.400", "neutralD.400")}
      w="100%"
    >
      {title ? (
        <HStack
          px={5}
          py={1}
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth="1px"
          borderBottomColor={useColorModeValue("neutral.400", "neutralD.400")}
        >
          <Text
            fontSize="sm"
            fontWeight="500"
            color={useColorModeValue("neutral.1000", "neutralD.1000")}
          >
            {title}
          </Text>
          <Button
            size="sm"
            onClick={onCopy}
            variant="ghost"
            color={
              hasCopied
                ? useColorModeValue("green.600", "green.100")
                : useColorModeValue("neutral.1000", "neutralD.1000")
            }
            bg={hasCopied ? useColorModeValue("green.50", "green.800") : undefined}
            leftIcon={
              hasCopied ? (
                <Icon as={CheckIcon} boxSize={4.5} />
              ) : (
                <Icon as={DocumentDuplicateIcon} boxSize={4.5} />
              )
            }
          >
            {hasCopied ? "Copied" : "Copy"}
          </Button>
        </HStack>
      ) : null}
      <Highlight codeString={editorCode} language={language} showLines={false} ln={ln} />
    </Box>
  );
};

export default Codeblock;
