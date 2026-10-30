import { Heading, VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";

import PageTransition from "@/components/page-transitions";
import Section from "@/components/section";
import type { GenericPageSummary } from "@/types/content";

interface PageLayoutProps {
  children: ReactNode;
  page: GenericPageSummary;
}

const PageLayout = ({ children, page }: PageLayoutProps) => {
  return (
    <Section>
      <PageTransition>
        <article>
          <VStack w="100%" align="stretch" gap={6}>
            <VStack align="stretch" gap={6} mb={4}>
              <Heading as="h1">{page.title}</Heading>
            </VStack>
          </VStack>
          <div>{children}</div>
        </article>
      </PageTransition>
    </Section>
  );
};

export default PageLayout;
