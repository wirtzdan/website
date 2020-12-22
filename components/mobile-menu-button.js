import React from "react";
import { VStack, Text, useColorModeValue } from "@chakra-ui/react";

const MobileMenuButton = ({ label, icon, ...rest }) => {
  return (
    <VStack
      as="button"
      spacing={0}
      rounded="md"
      px={6}
      {...rest}
      color={useColorModeValue("blue.600", "blue.200")}
    >
      {icon}
      <Text
        fontSize="xs"
        fontWeight="500"
        color={useColorModeValue("gray.600", "gray.200")}
      >
        {label}
      </Text>
    </VStack>
  );
};

export default MobileMenuButton;
