import React from "react";
import {
  Box,
  Center,
  HStack,
  IconButton,
  useColorModeValue,
  Button,
  VStack,
} from "@chakra-ui/react";
import { Mail } from "heroicons-react";

import { motion, useCycle } from "framer-motion";
import MenuToggle from "./mobile-menu-toggle";
import MobileMenuItem from "./mobile-menu-item";
import ThemeToggle from "./theme-toggle";
import NewsletterDrawer from "./newsletter-drawer";

const MobileNavigation = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);

  const links = [
    {
      route: `/`,
      title: `Home`,
    },
    {
      route: `/about`,
      title: `About`,
    },
    {
      route: `/blog`,
      title: `Blog`,
    },
    {
      route: `/books`,
      title: `Books`,
    },
  ];

  const menuvariants = {
    open: {
      opacity: 1,
    },
    closed: {
      opacity: 0,
    },
  };

  const navvariants = {
    open: {
      transition: { staggerChildren: 0.15, delayChildren: 0.25 },
    },
    closed: {},
  };

  const MotionBox = motion.custom(Box);
  const MotionVStack = motion.custom(VStack);

  return (
    <MotionBox
      initial={false}
      animate={isOpen ? "open" : "closed"}
      position="fixed"
      bottom="0"
      right="0"
      left="0"
      display={{ base: "block", md: "none" }}
    >
      <Center
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={16}
        display={isOpen ? "flex" : "none"}
      >
        <MotionBox
          variants={menuvariants}
          position="relative"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          w="100%"
          h="100%"
          bg={useColorModeValue("gray.100", "gray.700")}
          p={4}
          display={isOpen ? "flex" : "none"}
        >
          <MotionVStack variants={navvariants} spacing={4}>
            {links.map((link) => (
              <MobileMenuItem
                key={link.title}
                href={link.route}
                title={link.title}
                toggle={() => toggleOpen()}
              ></MobileMenuItem>
            ))}
          </MotionVStack>
        </MotionBox>
      </Center>
      <HStack
        justify="space-around"
        align="center"
        py={2}
        mt="auto"
        height={16}
        bg={useColorModeValue("white", "gray.800")}
        borderTopWidth="2px"
        borderTopColor={useColorModeValue("gray.100", "gray.700")}
      >
        <NewsletterDrawer mobile />
        <MenuToggle toggle={() => toggleOpen()} />
        <ThemeToggle mobile />
      </HStack>
    </MotionBox>
  );
};

export default MobileNavigation;
