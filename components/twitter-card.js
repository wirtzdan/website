import React from "react";
import {
  Heading,
  VStack,
  Text,
  HStack,
  Box,
  Button,
  Link,
  LightMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { TwitterLogo } from "phosphor-react";

const TwitterCard = ({ title, slug }) => {
  const url = "https://danielwirtz.com/blog/" + slug;

  return (
    <VStack
      p={4}
      bg={useColorModeValue("blue.50", "blue.100")}
      rounded="lg"
      borderWidth="1px"
      color={useColorModeValue("blue.800", "blue.800")}
      borderColor={useColorModeValue("blue.100", "blue.200")}
      textAlign="left"
      align="stretch"
      spacing={4}
      position="relative"
      mt={6}
    >
      <Text>Did you like the article?</Text>
      <Link
        href={`https://twitter.com/intent/tweet?text=${
          encodeURIComponent(title) + " " + "by @wirtzdan"
        }&url=${encodeURIComponent(url)}`}
        unstyled
      >
        <LightMode>
          <Button
            leftIcon={<TwitterLogo weight="fill" />}
            colorScheme="blue"
            transition="all 0.25s"
            transition-timing-function="spring(1 100 10 10)"
            _hover={{ transform: "translateY(-4px)", shadow: "sm" }}
          >
            Share on Twitter
          </Button>
        </LightMode>
      </Link>
    </VStack>
  );
};

export default TwitterCard;
