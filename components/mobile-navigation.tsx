"use client";

import { Center, HStack, useColorModeValue } from "@chakra-ui/react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import NextLink from "next/link";

import MobileMenuButton from "./mobile-menu-button";
import MenuToggle from "./mobile-menu-toggle";
import ThemeToggle from "./theme-toggle";

const MotionNav = motion.nav;

const MobileNavigation = () => {
  return (
    <MotionNav
      initial={false}
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        left: 0,
        display: "block",
      }}
    >
      <HStack
        justify="space-around"
        align="center"
        py={2}
        mt="auto"
        height={16}
        bg={useColorModeValue("white", "neutralD.100")}
        borderTopWidth="2px"
        borderTopColor={useColorModeValue("neutral.400", "neutralD.400")}
        shadow="0 -2px 10px 0 rgba(0,0,0, 0.035);"
        display={{ base: "flex", md: "none" }}
      >
        <Center w="100%">
          <NextLink
            href="/blog"
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <MobileMenuButton as="span" label="Blog" icon={<PencilIcon />} px={6} />
          </NextLink>
        </Center>

        <Center w="100%">
          <MenuToggle />
        </Center>

        <Center w="100%">
          <ThemeToggle mobile />
        </Center>
      </HStack>
    </MotionNav>
  );
};

export default MobileNavigation;
