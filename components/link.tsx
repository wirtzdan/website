import NextLink from "next/link";
import { chakra, useColorModeValue, type LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface CustomLinkProps extends ChakraLinkProps {
  href: string;
  children?: ReactNode;
  unstyled?: boolean;
}

const Link = ({ href, unstyled = false, children, ...props }: CustomLinkProps) => {
  const isInternalLink = href.startsWith("/") || href.startsWith("#");
  const sharedProps = {
    ...props,
    children,
  };

  if (unstyled) {
    return isInternalLink ? (
      <NextLink href={href} passHref legacyBehavior>
        <chakra.a {...sharedProps} />
      </NextLink>
    ) : (
      <chakra.a href={href} {...sharedProps} />
    );
  }

  const styledProps = {
    fontWeight: "400",
    color: useColorModeValue("primary.900", "primaryD.900"),
    transition: "all 0.25s",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    _hover: {
      color: useColorModeValue("primary.1000", "primaryD.1000"),
      textDecoration: "underline",
    },
    ...sharedProps,
  };

  return isInternalLink ? (
    <NextLink href={href} passHref legacyBehavior>
      <chakra.a {...styledProps} />
    </NextLink>
  ) : (
    <chakra.a href={href} {...styledProps} />
  );
};

export default Link;
