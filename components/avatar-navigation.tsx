"use client";

import { Avatar } from "@chakra-ui/react";
import NextLink from "next/link";

const AvatarNavigation = () => {
  return (
    <NextLink href="/" style={{ display: "inline-flex" }}>
      <Avatar.Root as="span" size="sm" cursor="pointer">
        <Avatar.Fallback name="Daniel Wirtz" />
        <Avatar.Image src="/avatar-small.jpg" />
      </Avatar.Root>
    </NextLink>
  );
};

export default AvatarNavigation;
