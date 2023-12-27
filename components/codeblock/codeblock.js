import React, { useState } from "react";
import {
  Box,
  HStack,
  Text,
  Button,
  useClipboard,
  useColorModeValue,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import Highlight from "./highlight";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { getBlockTitle } from "notion-utils";
import { useNotionContext } from "react-notion-x";

const Codeblock = (props) => {
  const showLines = false;
  // const { className, children, viewlines, metastring, ln, ...rest } = props;
  const { block, defaultLanguage = "typescript", ln } = props;
  const { recordMap } = useNotionContext();
  const editorCode = getBlockTitle(block, recordMap);
  const language = (
    block.properties?.language?.[0]?.[0] || defaultLanguage
  ).toLowerCase();
  const { hasCopied, onCopy } = useClipboard(editorCode);

  const title = block.properties.caption;

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
          <HStack>
            <Button
              size="sm"
              onClick={onCopy}
              variant="ghost"
              color={
                hasCopied
                  ? useColorModeValue("green.600", "green.100")
                  : useColorModeValue("neutral.1000", "neutralD.1000")
              }
              bg={
                hasCopied
                  ? useColorModeValue("green.50", "green.800")
                  : undefined
              }
              leftIcon={
                hasCopied ? (
                  <Icon as={CheckIcon} size={18} />
                ) : (
                  <Icon as={DocumentDuplicateIcon} size={18} />
                )
              }
            >
              {hasCopied ? "Copied" : "Copy"}
            </Button>
          </HStack>
        </HStack>
      ) : undefined}
      <Highlight
        codeString={editorCode}
        language={language}
        showLines={showLines}
        ln={ln}
      />
    </Box>
  );
};

export default Codeblock;
