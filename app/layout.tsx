import type { Metadata, Viewport } from "next";

import LapseDevtools from "@/components/lapse-devtools";
import MarkFirstPaint from "@/components/mark-first-paint";
import { fontClassNames } from "@/lib/fonts";
import { siteMetadata } from "@/lib/site-metadata";

import AppProviders from "./providers";

import "@/lib/notion/notion-renderer-styles.css";
import "@/lib/notion/notion-custom-styles.css";

export const metadata: Metadata = siteMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2BB0EC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={fontClassNames}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <MarkFirstPaint />
        <LapseDevtools />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
