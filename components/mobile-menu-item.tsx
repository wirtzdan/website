"use client";

import { motion } from "framer-motion";
import NextLink from "next/link";
import { Button, useColorModeValue } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

interface MobileMenuItemProps {
  href: string;
  title: string;
}

const variants = {
  open: {
    y: 0,
    opacity: 1,
  },
  closed: {
    y: 20,
    opacity: 0,
  },
};

const MotionButton = motion(Button);

function MobileMenuItem({ href, title }: MobileMenuItemProps) {
  const pathname = usePathname();

  const isActive = href === "/" ? pathname === href : pathname.includes(href.split("/")[1] ?? href);

  return (
    <NextLink href={href} style={{ width: "100%", display: "block" }}>
      <MotionButton
        as="span"
        display="block"
        width="100%"
        size="lg"
        aria-current={isActive ? "page" : undefined}
        variants={variants}
        bg={useColorModeValue("neutral.100", "neutralD.100")}
        _activeLink={{
          color: useColorModeValue("neutral.1100", "neutralD.1100"),
          bg: useColorModeValue("neutral.200", "neutralD.400"),
        }}
        _hover={{
          backgroundColor: useColorModeValue("neutral.300", "neutralD.300"),
        }}
      >
        {title}
      </MotionButton>
    </NextLink>
  );
}

export default MobileMenuItem;
