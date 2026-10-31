"use client";
import React from "react";
import { LightMode } from "./ui/color-mode";
import { Button, Text, VStack } from "@chakra-ui/react";
import { TwitterLogo } from "phosphor-react";

import Link from "@/components/link";
import { absoluteUrl } from "@/lib/site-url";

interface TwitterCardProps {
  title: string;
  slug: string;
}

const TwitterCard = ({ title, slug }: TwitterCardProps) => {
  const url = absoluteUrl(`/blog/${slug}`);

  return (
    <VStack
      p={4}
      bg={{ _light: "blue.50", _dark: "blue.100" }}
      rounded="lg"
      borderWidth="1px"
      color={"blue.800"}
      borderColor={{ _light: "blue.100", _dark: "blue.200" }}
      textAlign="left"
      align="stretch"
      gap={4}
      position="relative"
      mt={6}
    >
      <Text>Did you like the article?</Text>
      <Link
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `${title} by @wirtzdan`,
        )}&url=${encodeURIComponent(url)}`}
        unstyled
      >
        <LightMode>
          <Button
            colorPalette="blue"
            transition="all 0.25s"
            transitionTimingFunction="spring(1 100 10 10)"
            _hover={{ transform: "translateY(-4px)", shadow: "sm" }}
          >
            <TwitterLogo weight="fill" />
            Share on Twitter
          </Button>
        </LightMode>
      </Link>
    </VStack>
  );
};

export default TwitterCard;
