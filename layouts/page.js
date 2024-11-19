import React from "react";
import Section from "@/components/section";
import { Heading, VStack, Box } from "@chakra-ui/react";
import BlogSeo from "@/components/blog-seo";
import Header from "../components/header";
import Footer from "../components/footer";
import MobileNavigation from "@/components/mobile-navigation";

import PageTransition from "../components/page-transitions";

class PageLayout extends React.Component {
  render() {
    const { showNavigation } = this.props;
    const target = React.createRef();

    return (
      <PageTransition>
        <>
          {showNavigation && <Header />}
          <Box as="main" pt={{ base: 16, md: 32 }} pb={{ base: 24, md: 16 }}>
            <Section>
              <article ref={target}>
                <VStack w="100%" align="left" spacing={6}>
                  <VStack align="stretch" spacing={6} mb={4}>
                    <Heading as="h1">{this.props.page.title}</Heading>
                  </VStack>
                </VStack>
                <div>{this.props.children}</div>
              </article>

              <div ref={(el) => (this.div = el)}></div>
            </Section>
          </Box>
          {showNavigation && <MobileNavigation />}
          {showNavigation && <Footer />}
        </>
      </PageTransition>
    );
  }
}

export default PageLayout;
