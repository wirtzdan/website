import type { ReactNode } from "react";
import { SlideFade } from "@chakra-ui/react";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  return <SlideFade in>{children}</SlideFade>;
};

export default PageTransition;
