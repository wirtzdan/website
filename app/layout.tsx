import type { Metadata, Viewport } from "next";

import AppProviders from "./providers";
import { fontClassNames } from "@/lib/fonts";
import { siteMetadata } from "@/lib/site-metadata";

import "@/lib/notion/notion-renderer-styles.css";
import "@/lib/notion/notion-custom-styles.css";
import "prismjs/themes/prism-tomorrow.css";

export const metadata: Metadata = siteMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2BB0EC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontClassNames} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
