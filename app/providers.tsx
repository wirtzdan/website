"use client";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ChakraProvider } from "@chakra-ui/react";
import React, { useEffect, useState, type ReactNode } from "react";
import { clarity } from "react-microsoft-clarity";
import PlausibleProvider from "next-plausible";
import { useServerInsertedHTML } from "next/navigation";

import { ColorModeProvider } from "@/components/ui/color-mode";
import FontFace from "@/components/font-face";
import customTheme from "@/theme";

function EmotionRegistry({ children }: { children: ReactNode }) {
  const [cache] = useState(() => {
    const emotionCache = createCache({ key: "css" });
    // compat makes Emotion's server <Global> return null instead of a <style>
    // tag. The browser build already returns null, so the trees can hydrate.
    emotionCache.compat = true;
    return emotionCache;
  });

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted);
    if (names.length === 0) {
      return null;
    }

    let styles = "";
    for (const name of names) {
      const inserted = cache.inserted[name];
      if (typeof inserted === "string") {
        styles += inserted;
      }
    }

    for (const name of names) {
      delete cache.inserted[name];
    }

    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

export default function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    clarity.init("kcefbongzq");
  }, []);

  return (
    <EmotionRegistry>
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
    </EmotionRegistry>
  );
}
