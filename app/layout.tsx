import type { Metadata, Viewport } from "next";

import LapseDevtools from "@/components/lapse-devtools";
import MarkFirstPaint from "@/components/mark-first-paint";
import { fontClassNames } from "@/lib/fonts";
import { THEME_COLOR, siteMetadata } from "@/lib/site-metadata";

import AppProviders from "./providers";

export const metadata: Metadata = siteMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: THEME_COLOR,
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
