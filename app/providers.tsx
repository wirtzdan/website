"use client";

import React, { useEffect, type ReactNode } from "react";
import { clarity } from "react-microsoft-clarity";
import PlausibleProvider from "next-plausible";

import FontFace from "@/components/font-face";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";

export default function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    clarity.init("kcefbongzq");
  }, []);

  return (
    <Provider>
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
        <Toaster />
      </PlausibleProvider>
    </Provider>
  );
}
