"use client";

import NextLink from "next/link";
import { Link as ChakraLink, type LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import { forwardRef } from "react";

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

  if (unstyled) {
    if (!isInternalLink) {
      return (
        <ChakraLink
          ref={ref}
          unstyled
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          {...props}
        >
          {children}
        </ChakraLink>
      );
    }
    return (
      <ChakraLink ref={ref} unstyled asChild {...props}>
        <NextLink href={href}>{children}</NextLink>
      </ChakraLink>
    );
  }

  if (!isInternalLink) {
    return (
      <ChakraLink
        ref={ref}
        variant="plain"
        colorPalette="blue"
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </ChakraLink>
    );
  }

  return (
    <ChakraLink ref={ref} variant="plain" colorPalette="blue" asChild {...props}>
      <NextLink href={href}>{children}</NextLink>
    </ChakraLink>
  );
});

export default Link;
