import type { ReactNode } from "react";
import { Box } from "@chakra-ui/react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import MobileNavigation from "@/components/mobile-navigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Header />
      <Box as="main" pt={{ base: 16, md: 32 }} pb={{ base: 24, md: 16 }}>
        {children}
      </Box>
      <MobileNavigation />
      <Footer />
    </div>
  );
}
