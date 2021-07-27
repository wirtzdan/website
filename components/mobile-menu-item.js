import React from "react";
import { motion } from "framer-motion";
import { Button, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 20,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const MotionButton = motion(Button);

function MobileMenuItem({ href, title, toggle }) {
  var isActive = false;
  const { pathname } = useRouter();

  if (href !== "/") {
    const [, group] = href.split("/");

    isActive = pathname.includes(group);
  } else {
    if (href === pathname) {
      isActive = true;
    }
  }

  return (
    <Link href={href}>
      <MotionButton
        size="lg"
        aria-current={isActive ? "page" : undefined}
        w="100%"
        variants={variants}
        _activeLink={{
          color: useColorModeValue("blue.500", "blue.200"),
        }}
      >
        {title}
      </MotionButton>
    </Link>
  );
}
export default MobileMenuItem;
