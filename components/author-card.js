import React from "react";
import {
  HStack,
  Avatar,
  VStack,
  Text,
  Button,
  useClipboard,
  Stack,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { format } from "timeago.js";
import { CheckIcon, LinkIcon } from "@heroicons/react/20/solid";

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
          leftIcon={
            hasCopied ? <Icon as={CheckIcon} /> : <Icon as={LinkIcon} />
          }
        >
          {hasCopied ? "Copied" : "Copy link"}
        </Button>
      </HStack>
    </Stack>
  );
};

export default AuthorCard;
