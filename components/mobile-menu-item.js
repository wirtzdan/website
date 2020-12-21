import React from "react";
import { motion } from "framer-motion";
import { Button } from "@chakra-ui/react";
import Link from "next/link";

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

const MotionButton = motion.custom(Button);

function MobileMenuItem({ href, title }) {
  return (
    <Link href={href}>
      <MotionButton size="lg" variants={variants}>
        {title}
      </MotionButton>
    </Link>
  );
}
export default MobileMenuItem;
