"use client";
import { useColorModeValue } from "./ui/color-mode";
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
  const labelColor = useColorModeValue("neutral.1100", "neutralD.1100");
  const idleBackground = useColorModeValue("neutral.100", "neutralD.100");
  const activeBackground = useColorModeValue("neutral.200", "neutralD.400");
  const hoverBackground = useColorModeValue("neutral.300", "neutralD.300");

  return (
    <Button
      asChild
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
      <NextLink href={href}>{title}</NextLink>
    </Button>
  );
}

export default MobileMenuItem;
