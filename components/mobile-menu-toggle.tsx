"use client";

import { useDisclosure } from "@/lib/use-disclosure";
import React from "react";
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
import { Tooltip } from "@/components/ui/tooltip";
import { GithubLogo, LinkedinLogo, TwitterLogo, YoutubeLogo } from "phosphor-react";
import { Bars3Icon } from "@heroicons/react/24/solid";

import MobileMenuButton from "./mobile-menu-button";
import MobileMenuItem from "./mobile-menu-item";

interface MobileMenuToggleProps {
  mobile?: boolean;
}

const MobileMenuToggle = ({ mobile }: MobileMenuToggleProps) => {
  const { open, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <Box>
      <Tooltip content="Newsletter">
        <MobileMenuButton
          label="Menu"
          icon={<Bars3Icon width={20} height={20} />}
          onClick={onOpen}
        />
      </Tooltip>
      <Drawer.Root
        open={open}
        placement="bottom"
        finalFocusEl={() => btnRef.current}
        onOpenChange={(e) => {
          if (!e.open) {
            onClose();
          }
        }}
      >
        <Portal>
          <Drawer.Backdrop>
            <Drawer.Positioner>
              <Drawer.Content
                borderTopRadius="6px"
                bg={{ _light: "neutral.50", _dark: "neutralD.50" }}
              >
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" aria-label="Close menu" />
                </Drawer.CloseTrigger>
                <Drawer.Header>
                  <Drawer.Title textStyle="sm" fontWeight="normal">
                    Menu
                  </Drawer.Title>
                </Drawer.Header>
                <Drawer.Body pb={4}>
                  <VStack gap={4}>
                    <VStack w="100%">
                      <MobileMenuItem href="/" title="Home" />
                      <SimpleGrid columns={1} gap={2} w="100%">
                        <MobileMenuItem href="/about" title="About" />
                        <MobileMenuItem href="/blog" title="Blog" />
                        <MobileMenuItem href="/bookmarks" title="Bookmarks" />
                        <MobileMenuItem href="/books" title="Books" />
                        <MobileMenuItem href="/tools" title="Tools" />
                      </SimpleGrid>
                    </VStack>

                    <Separator />
                    <HStack justifyContent="center" w="100%">
                      <HStack gap={2}>
                        <IconButton
                          asChild
                          aria-label="Twitter"
                          size="sm"
                          variant="ghost"
                          color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}
                        >
                          <a
                            href="https://twitter.com/wirtzdan/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <TwitterLogo weight="fill" />
                          </a>
                        </IconButton>
                        <IconButton
                          asChild
                          aria-label="LinkedIn"
                          size="sm"
                          variant="ghost"
                          color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}
                        >
                          <a
                            href="https://www.linkedin.com/in/wirtzdan/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <LinkedinLogo weight="fill" />
                          </a>
                        </IconButton>
                        <IconButton
                          asChild
                          aria-label="GitHub"
                          size="sm"
                          variant="ghost"
                          color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}
                        >
                          <a
                            href="https://github.com/wirtzdan"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <GithubLogo weight="fill" />
                          </a>
                        </IconButton>
                        <IconButton
                          asChild
                          aria-label="YouTube"
                          size="sm"
                          variant="ghost"
                          color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}
                        >
                          <a
                            href="https://www.youtube.com/channel/UCje_bQMr6F45x0Auii7IOvA"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <YoutubeLogo weight="fill" />
                          </a>
                        </IconButton>
                      </HStack>
                    </HStack>
                  </VStack>
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Positioner>
          </Drawer.Backdrop>
        </Portal>
      </Drawer.Root>
    </Box>
  );
};

export default MobileMenuToggle;
