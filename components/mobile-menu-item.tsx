"use client";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { Button } from "@chakra-ui/react";
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
        variant="ghost"
        aria-current={isActive ? "page" : undefined}
        variants={variants}
        _currentPage={{
          bg: "bg.muted",
        }}
      >
        {title}
      </MotionButton>
    </NextLink>
  );
}

export default MobileMenuItem;
