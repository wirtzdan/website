"use client";

import { useDisclosure } from "@/lib/use-disclosure";
import {
  Box,
  CloseButton,
  Drawer,
  IconButton,
  SimpleGrid,
  HStack,
  VStack,
  Separator,
  Portal,
} from "@chakra-ui/react";
import {
  RiCloseLine,
  RiGithubFill,
  RiLinkedinFill,
  RiMenuLine,
  RiTwitterFill,
  RiYoutubeFill,
} from "@remixicon/react";

import MobileMenuButton from "./mobile-menu-button";
import MobileMenuItem from "./mobile-menu-item";

// Backdrop and sheet share one curve. Open is 200ms, close is 150ms.
// ease-in-smooth is cubic-bezier(0.32, 0.72, 0, 1): a strong ease-out.
const drawerMotion = {
  "&[data-state=open]": {
    animationDuration: "moderate",
    animationTimingFunction: "ease-in-smooth",
  },
  "&[data-state=closed]": {
    animationDuration: "fast",
    animationTimingFunction: "ease-in-smooth",
  },
  "@media (prefers-reduced-motion: reduce)": {
    "&[data-state=open]": { animationName: "fade-in" },
    "&[data-state=closed]": { animationName: "fade-out" },
  },
};

const MobileMenuToggle = () => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <MobileMenuButton label="Menu" icon={<RiMenuLine size={20} />} onClick={onOpen} />
      <Drawer.Root
        open={open}
        placement="bottom"
        onOpenChange={(e) => {
          if (!e.open) {
            onClose();
          }
        }}
      >
        <Portal>
          <Drawer.Backdrop css={drawerMotion} />
          <Drawer.Positioner>
            <Drawer.Content
              borderTopRadius="6px"
              bg={{ _light: "neutral.50", _dark: "neutralD.50" }}
              css={drawerMotion}
            >
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" aria-label="Close menu">
                  <RiCloseLine />
                </CloseButton>
              </Drawer.CloseTrigger>
              <Drawer.Header>
                <Drawer.Title textStyle="sm" fontWeight="normal">
                  Menu
                </Drawer.Title>
              </Drawer.Header>
              <Drawer.Body pb="calc(1rem + var(--safe-bottom, 0px))">
                <VStack gap={4}>
                  <VStack w="100%">
                    <MobileMenuItem href="/" title="Home" />
                    <SimpleGrid columns={1} gap={2} w="100%">
                      <MobileMenuItem href="/about" title="About" />
                      <MobileMenuItem href="/blog" title="Blog" />
                      <MobileMenuItem href="/bookmarks" title="Bookmarks" />
                      <MobileMenuItem href="/books" title="Books" />
                      <MobileMenuItem href="/tools" title="Tools" />
                      <MobileMenuItem href="/privacy" title="Privacy" />
                      <MobileMenuItem href="mailto:daniel@danielwirtz.com" title="Contact" />
                    </SimpleGrid>
                  </VStack>

                  <Separator />
                  <HStack justifyContent="center" w="100%">
                    <HStack gap={2}>
                      <IconButton
                        asChild
                        aria-label="Twitter"
                        size={{ base: "lg", md: "sm" }}
                        variant="ghost"
                        color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}
                      >
                        <a
                          href="https://twitter.com/wirtzdan/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <RiTwitterFill />
                        </a>
                      </IconButton>
                      <IconButton
                        asChild
                        aria-label="LinkedIn"
                        size={{ base: "lg", md: "sm" }}
                        variant="ghost"
                        color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}
                      >
                        <a
                          href="https://www.linkedin.com/in/wirtzdan/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <RiLinkedinFill />
                        </a>
                      </IconButton>
                      <IconButton
                        asChild
                        aria-label="GitHub"
                        size={{ base: "lg", md: "sm" }}
                        variant="ghost"
                        color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}
                      >
                        <a
                          href="https://github.com/wirtzdan"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <RiGithubFill />
                        </a>
                      </IconButton>
                      <IconButton
                        asChild
                        aria-label="YouTube"
                        size={{ base: "lg", md: "sm" }}
                        variant="ghost"
                        color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}
                      >
                        <a
                          href="https://www.youtube.com/channel/UCje_bQMr6F45x0Auii7IOvA"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <RiYoutubeFill />
                        </a>
                      </IconButton>
                    </HStack>
                  </HStack>
                </VStack>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Box>
  );
};

export default MobileMenuToggle;
