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
import { PencilIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { motion, useCycle } from "framer-motion";
import MenuToggle from "./mobile-menu-toggle";
import MobileMenuItem from "./mobile-menu-item";
import ThemeToggle from "./theme-toggle";
import NewsletterDrawer from "./newsletter-drawer";
import MobileMenuButton from "./mobile-menu-button";
import Link from "next/link";

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

  const MotionBox = motion(Box);
  const MotionVStack = motion(VStack);

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
      >
        <Center w="100%">
          <Link href="/blog" px={6} legacyBehavior>
            <MobileMenuButton
              label="Blog"
              icon={<PencilIcon />}
            ></MobileMenuButton>
          </Link>
        </Center>

        <Center w="100%">
          <MenuToggle toggle={() => toggleOpen()} />
        </Center>
        <Center w="100%">
          <ThemeToggle mobile />
        </Center>
        {/*   <Center w="100%">
          <Link href="/newsletter" px={6}>
            <MobileMenuButton
              label="Newsletter"
              icon={<EnvelopeIcon />}
            ></MobileMenuButton>
          </Link>
        </Center> */}
        {/* <Center w="100%">
          <NewsletterDrawer mobile />
        </Center> */}
      </HStack>
    </MotionBox>
  );
};

export default MobileNavigation;
