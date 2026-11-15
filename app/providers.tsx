"use client";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ChakraProvider } from "@chakra-ui/react";
import React, { useEffect, useState, type ReactNode } from "react";
import { clarity } from "react-microsoft-clarity";
import PlausibleProvider from "next-plausible";
import { useServerInsertedHTML } from "next/navigation";

import { ColorModeProvider } from "@/components/ui/color-mode";
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
    // Clarity is session analytics, not page content. Start it once the page
    // has loaded and the main thread is idle so it does not compete with the
    // first render on slow phones.
    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(() => clarity.init("kcefbongzq"), {
          timeout: 4000,
        });
      } else {
        timeoutHandle = setTimeout(() => clarity.init("kcefbongzq"), 1000);
      }
    };

    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }

    return () => {
      window.removeEventListener("load", start);
      if (idleHandle !== undefined) {
        window.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle);
      }
    };
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
          </PlausibleProvider>
        </ColorModeProvider>
      </ChakraProvider>
    </EmotionRegistry>
  );
}
