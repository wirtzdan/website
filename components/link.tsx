"use client";

import NextLink from "next/link";
import {
  chakra,
  shouldForwardProp,
  useColorModeValue,
  type LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import { forwardRef } from "react";

const ChakraNextLink = chakra(NextLink, {
  shouldForwardProp: (prop) =>
    shouldForwardProp(prop) ||
    ["href", "replace", "scroll", "shallow", "prefetch", "locale"].includes(String(prop)),
});

export type CustomLinkProps = Omit<ChakraLinkProps, "href"> & {
  href: string;
  unstyled?: boolean;
};

const Link = forwardRef<HTMLAnchorElement, CustomLinkProps>(function Link(
  { href, unstyled = false, children, isExternal, ...props },
  ref,
) {
  const isInternalLink = href.startsWith("/") || href.startsWith("#");
  const primaryColor = useColorModeValue("primary.900", "primaryD.900");
  const primaryHover = useColorModeValue("primary.1000", "primaryD.1000");

  const styled = !unstyled
    ? {
        fontWeight: "400",
        color: primaryColor,
        transition: "all 0.25s",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        _hover: {
          color: primaryHover,
          textDecoration: "underline",
        },
      }
    : {};

  if (!isInternalLink) {
    return (
      <chakra.a
        ref={ref}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...styled}
        {...props}
      >
        {children}
      </chakra.a>
    );
  }

  return (
    <ChakraNextLink ref={ref} href={href} {...styled} {...props}>
      {children}
    </ChakraNextLink>
  );
});

export default Link;
