"use client";

import type { ReactNode } from "react";
import { Presence } from "@chakra-ui/react";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <Presence
      present
      animationName={{
        _open: "slide-from-bottom, fade-in",
        _closed: "slide-to-bottom, fade-out",
      }}
      animationDuration="moderate"
    >
      {children}
    </Presence>
  );
};

export default PageTransition;
