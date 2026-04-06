import { IBM_Plex_Mono, IBM_Plex_Sans, Sora } from "next/font/google";

export const fontSora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
  weight: ["400", "500", "600", "700", "800"],
});

export const fontIbmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-sans",
  weight: ["400", "500", "600", "700"],
});

export const fontIbmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
});

export const fontClassNames = `${fontSora.variable} ${fontIbmPlexSans.variable} ${fontIbmPlexMono.variable}`;
