import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import MobileNavigation from "@/components/mobile-navigation";
import { Box } from "@chakra-ui/react";

export default function Layout({ children }) {
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
