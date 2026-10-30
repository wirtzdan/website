import type { ReactNode } from "react";
import { Box, Link } from "@chakra-ui/react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import MobileNavigation from "@/components/mobile-navigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Link
        href="#content"
        srOnly
        _focusVisible={{
          position: "fixed",
          top: "4",
          insetInlineStart: "4",
          zIndex: "tooltip",
          w: "auto",
          h: "auto",
          m: "0",
          px: "3",
          py: "2",
          overflow: "visible",
          clip: "auto",
          whiteSpace: "normal",
          rounded: "md",
          shadow: "md",
          fontWeight: "600",
          textDecoration: "none",
          bg: { _light: "white", _dark: "neutralD.100" },
          color: { _light: "neutral.1100", _dark: "neutralD.1100" },
          borderWidth: "1px",
          borderColor: { _light: "neutral.400", _dark: "neutralD.400" },
        }}
      >
        Skip to content
      </Link>
      <Header />
      <Box
        as="main"
        id="content"
        tabIndex={-1}
        pt={{ base: 16, md: 32 }}
        pb={{ base: 24, md: 16 }}
        _focusVisible={{ outline: "none" }}
      >
        {children}
      </Box>
      <MobileNavigation />
      <Footer />
    </div>
  );
}
