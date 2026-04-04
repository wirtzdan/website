import { Avatar } from "@chakra-ui/react";
import NextLink from "next/link";

const AvatarNavigation = () => {
  return (
    <NextLink href="/" passHref legacyBehavior>
      <Avatar
        as="a"
        name="Daniel Wirtz"
        size="sm"
        src="/avatar-small.jpg"
        cursor="pointer"
      />
    </NextLink>
  );
};

export default AvatarNavigation;
