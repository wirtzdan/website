import React from "react";
import {
  Box,
  HStack,
  Avatar,
  VStack,
  Text,
  Button,
  useClipboard,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { format } from "timeago.js";
import {
  ClipboardCheckOutline,
  ClipboardCopyOutline,
  Duplicate,
  Link,
  Check,
} from "heroicons-react";

const AuthorCard = ({ readingTime, publishedAt, url }) => {
  const { hasCopied, onCopy } = useClipboard(url);

  return (
    <Stack direction="row" justify="space-between">
      <HStack>
        <Avatar src="/avatar-small.jpg" h={10} w={10}></Avatar>
        <VStack spacing={0} align="start">
          <Text fontSize="md" fontWeight="500">
            Daniel Wirtz
          </Text>
          <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.200")}>
            {format(publishedAt)} • {readingTime}
          </Text>
        </VStack>
      </HStack>
      <HStack>
        <Button
          onClick={onCopy}
          ml={2}
          variant="outline"
          size={["sm"]}
          color={
            hasCopied
              ? useColorModeValue("green.600", "green.200")
              : useColorModeValue("neutralD.100", "gray.100")
          }
          bg={useColorModeValue("white", "neutralD.100")}
          leftIcon={hasCopied ? <Check size={18} /> : <Link size={18} />}
        >
          {hasCopied ? "Copied" : "Copy link"}
        </Button>
      </HStack>
    </Stack>
  );
};

export default AuthorCard;
