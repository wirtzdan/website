"use client";
import { Box, Center, HStack } from "@chakra-ui/react";
import { RiPencilLine } from "@remixicon/react";
import NextLink from "next/link";

import MobileMenuButton from "./mobile-menu-button";
import MenuToggle from "./mobile-menu-toggle";
import ThemeToggle from "./theme-toggle";

const MobileNavigation = () => {
  return (
    <Box as="nav" position="fixed" bottom={0} right={0} left={0} display="block">
      <HStack
        justify="space-around"
        align="center"
        mt="auto"
        h="calc(4rem + var(--safe-bottom, 0px))"
        pb="var(--safe-bottom, 0px)"
        ps="var(--safe-left, 0px)"
        pe="var(--safe-right, 0px)"
        bg={{ _light: "white", _dark: "neutralD.100" }}
        borderTopWidth="2px"
        borderTopColor={{ _light: "neutral.400", _dark: "neutralD.400" }}
        shadow="0 -2px 10px 0 rgba(0,0,0, 0.035);"
        display={{ base: "flex", md: "none" }}
      >
        <Center w="100%">
          <NextLink
            href="/blog"
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <MobileMenuButton as="span" label="Blog" icon={<RiPencilLine size={20} />} px={6} />
          </NextLink>
        </Center>

        <Center w="100%">
          <MenuToggle />
        </Center>

        <Center w="100%">
          <ThemeToggle mobile />
        </Center>
      </HStack>
    </Box>
  );
};

export default MobileNavigation;
