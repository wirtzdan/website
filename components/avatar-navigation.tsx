"use client";

import { Avatar } from "@chakra-ui/react";
import NextLink from "next/link";

const AvatarNavigation = () => {
  return (
    <NextLink href="/" aria-label="Home" style={{ display: "inline-flex" }}>
      <Avatar.Root
        as="span"
        size="sm"
        cursor="pointer"
        _before={{
          content: '""',
          position: "absolute",
          inset: "-4px",
        }}
      >
        <Avatar.Fallback name="Daniel Wirtz" />
        <Avatar.Image alt="" src="/avatar-small.jpg" />
      </Avatar.Root>
    </NextLink>
  );
};

export default AvatarNavigation;
