"use client";
import { Box, Button, HStack, VStack } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import AvatarNavigation from "./avatar-navigation";
import Container from "./container";
import ListsMenu from "./lists-menu";
import ThemeToggle from "./theme-toggle";

interface NavLinkProps {
  href: string;
  name: string;
}

function NavLink({ href, name, ...rest }: NavLinkProps) {
  const pathname = usePathname();
  let isActive = false;

  if (href !== "/") {
    const [, group] = href.split("/");
    isActive = pathname.includes(group);
  } else if (href === pathname) {
    isActive = true;
  }

  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      variant="ghost"
      size="md"
      _currentPage={{
        color: useColorModeValue("neutral.1100", "neutralD.1100"),
        bg: useColorModeValue("neutral.100", "neutralD.300"),
      }}
      _hover={{
        bg: useColorModeValue("neutral.200", "neutralD.200"),
      }}
      px={4}
      {...rest}
      asChild
    >
      <NextLink href={href}>{name}</NextLink>
    </Button>
  );
}

const Header = () => {
  const menuBg = useColorModeValue("white", "neutralD.100");
  const menuBorderColor = useColorModeValue("neutral.400", "neutralD.400");

  return (
    <Box
      as="header"
      bg={menuBg}
      display={{ base: "none", md: "block" }}
      position="fixed"
      w="100%"
      zIndex={99}
      borderBottomWidth="1px"
      borderBottomColor={menuBorderColor}
      shadow="0 0 10px 0 rgba(0,0,0, 0.025);"
    >
      <Container>
        <VStack align="start" gap={0}>
          <HStack justify="space-between" w="100%" h={16}>
            <AvatarNavigation />
            <HStack as="nav" aria-label="Main" ml={-4} gap={2}>
              <NavLink href="/blog" name="Blog" />
              <NavLink href="/about" name="About" />
              <ListsMenu />
            </HStack>
            <HStack>
              <ThemeToggle />
            </HStack>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Header;
