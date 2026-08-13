"use client";
import { Icon, Text, VStack, type StackProps } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";
import type { ReactElement } from "react";

interface MobileMenuButtonProps extends StackProps {
  label: string;
  icon: ReactElement;
}

const MobileMenuButton = ({ label, icon, ...rest }: MobileMenuButtonProps) => {
  return (
    <VStack
      as="button"
      gap={0}
      rounded="md"
      px={6}
      {...rest}
      color={useColorModeValue("neutral.1100", "neutralD.1100")}
    >
      <Icon boxSize={5} asChild>
        {icon}
      </Icon>

      <Text
        fontSize="xs"
        fontWeight="500"
        color={useColorModeValue("neutral.1000", "neutralD.1000")}
      >
        {label}
      </Text>
    </VStack>
  );
};

export default MobileMenuButton;
