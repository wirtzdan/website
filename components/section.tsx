"use client";

import type { ReactNode } from "react";
import { Center, type CenterProps } from "@chakra-ui/react";

import Container from "./container";

interface SectionProps extends CenterProps {
  full?: boolean;
  children: ReactNode;
}

const Section = ({ full, children, ...rest }: SectionProps) => {
  return (
    <Center as="section" {...rest} w="100%">
      {full ? children : <Container>{children}</Container>}
    </Center>
  );
};

export default Section;
