import { Box, Heading, VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import MobileNavigation from "@/components/mobile-navigation";
import PageTransition from "@/components/page-transitions";
import Section from "@/components/section";
import type { GenericPageSummary } from "@/types/content";

interface PageLayoutProps {
  children: ReactNode;
  page: GenericPageSummary;
  showNavigation?: boolean;
}

const PageLayout = ({ children, page, showNavigation = false }: PageLayoutProps) => {
  return (
    <PageTransition>
      <>
        {showNavigation ? <Header /> : null}
        <Box as="main" pt={{ base: 16, md: 32 }} pb={{ base: 24, md: 16 }}>
          <Section>
            <article>
              <VStack w="100%" align="stretch" gap={6}>
                <VStack align="stretch" gap={6} mb={4}>
                  <Heading as="h1">{page.title}</Heading>
                </VStack>
              </VStack>
              <div>{children}</div>
            </article>
          </Section>
        </Box>
        {showNavigation ? <MobileNavigation /> : null}
        {showNavigation ? <Footer /> : null}
      </>
    </PageTransition>
  );
};

export default PageLayout;
