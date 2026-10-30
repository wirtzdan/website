import { IBM_Plex_Sans, Sora } from "next/font/google";

// Sora is a variable font. Omitting weight ships one file instead of a static
// file per weight, including the unused 800.
export const fontSora = Sora({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  variable: "--font-sora",
});

export const fontIbmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  variable: "--font-ibm-plex-sans",
  weight: ["400", "500", "600", "700"],
});

export const fontClassNames = `${fontSora.variable} ${fontIbmPlexSans.variable}`;
