"use client";

import { ChakraProvider } from "@chakra-ui/react";

import system from "@/theme";

import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function Provider(props: ColorModeProviderProps) {
  const { children, ...rest } = props;
  return (
    <ColorModeProvider {...rest}>
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </ColorModeProvider>
  );
}
