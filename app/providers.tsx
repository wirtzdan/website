"use client";

import { ChakraProvider } from "@chakra-ui/react";
import React, { useEffect, type ReactNode } from "react";
import { clarity } from "react-microsoft-clarity";
import PlausibleProvider from "next-plausible";

import { ColorModeProvider } from "@/components/ui/color-mode";
import FontFace from "@/components/font-face";
import customTheme from "@/theme";

export default function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    clarity.init("kcefbongzq");
  }, []);

  return (
    <ChakraProvider value={customTheme}>
      <ColorModeProvider>
        <PlausibleProvider
          src="https://plausible.io/js/script.js"
          scriptProps={
            { "data-domain": "danielwirtz.com" } as React.DetailedHTMLProps<
              React.ScriptHTMLAttributes<HTMLScriptElement>,
              HTMLScriptElement
            >
          }
        >
          {children}
          <FontFace />
        </PlausibleProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}
