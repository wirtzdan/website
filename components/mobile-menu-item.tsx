"use client";
import NextLink from "next/link";
import { Button } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

interface MobileMenuItemProps {
  href: string;
  title: string;
}

function isMenuPathActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function MobileMenuItem({ href, title }: MobileMenuItemProps) {
  const pathname = usePathname();
  const isActive = isMenuPathActive(pathname, href);

  // Solid buttons use colorPalette.contrast (near-white), which disappears on
  // the light menu sheet. Ghost plus an explicit label color stays readable.
  const labelColor = { _light: "neutral.1100", _dark: "neutralD.1100" };
  const idleBackground = { _light: "neutral.100", _dark: "neutralD.100" };
  const activeBackground = { _light: "neutral.200", _dark: "neutralD.400" };
  const hoverBackground = { _light: "neutral.300", _dark: "neutralD.300" };

  return (
    <Button
      asChild
      type={undefined}
      variant="ghost"
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      minH="44px"
      size="lg"
      aria-current={isActive ? "page" : undefined}
      color={labelColor}
      bg={idleBackground}
      fontWeight="500"
      _currentPage={{
        color: labelColor,
        bg: activeBackground,
        fontWeight: "600",
      }}
      _hover={{
        color: labelColor,
        backgroundColor: hoverBackground,
      }}
      _active={{
        color: labelColor,
        backgroundColor: hoverBackground,
      }}
    >
      {href.startsWith("mailto:") || href.startsWith("http") ? (
        <a href={href}>{title}</a>
      ) : (
        <NextLink href={href}>{title}</NextLink>
      )}
    </Button>
  );
}

export default MobileMenuItem;
