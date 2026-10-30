"use client";

import { Box } from "@chakra-ui/react";
import { useState, type ReactNode } from "react";

import { hasPainted } from "@/components/mark-first-paint";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Subtle rise on client navigations only. A full load renders in place so the
 * first paint is not held at opacity 0.
 *
 * To drop it: delete this file, remove MarkFirstPaint from app/layout.tsx,
 * and unwrap the article in layouts/page.tsx.
 */
const PageTransition = ({ children }: PageTransitionProps) => {
  const [play] = useState(hasPainted);

  return (
    <Box
      w="100%"
      animationName={
        play ? { base: "slide-from-bottom, fade-in", _motionReduce: "fade-in" } : undefined
      }
      animationDuration={play ? "moderate" : undefined}
      animationTimingFunction={play ? "ease-in-smooth" : undefined}
      animationFillMode={play ? "backwards" : undefined}
    >
      {children}
    </Box>
  );
};

export default PageTransition;
