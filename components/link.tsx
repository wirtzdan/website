"use client";

import NextLink from "next/link";
import { Link as ChakraLink, type LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import { forwardRef } from "react";

import { useColorModeValue } from "./ui/color-mode";

export type CustomLinkProps = Omit<ChakraLinkProps, "href"> & {
  href: string;
  unstyled?: boolean;
  isExternal?: boolean;
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
        fontWeight: "400" as const,
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
      <ChakraLink
        ref={ref}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...styled}
        {...props}
      >
        {children}
      </ChakraLink>
    );
  }

  return (
    <ChakraLink ref={ref} asChild {...styled} {...props}>
      <NextLink href={href}>{children}</NextLink>
    </ChakraLink>
  );
});

export default Link;
