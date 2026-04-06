"use client";
import { Icon, Text, VStack, type StackProps } from "@chakra-ui/react";
import type { ReactElement } from "react";

interface MobileMenuButtonProps extends StackProps {
  label: string;
  icon: ReactElement;
}

const MobileMenuButton = ({ label, icon, ...rest }: MobileMenuButtonProps) => {
  return (
    <VStack as="button" gap={0} rounded="md" px={6} {...rest} color="fg">
      <Icon as={() => icon} boxSize={5} />
      <Text fontSize="xs" fontWeight="500" color="fg.muted">
        {label}
      </Text>
    </VStack>
  );
};

export default MobileMenuButton;
