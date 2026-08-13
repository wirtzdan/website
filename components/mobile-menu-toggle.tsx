"use client";

import { useDisclosure } from "@/lib/use-disclosure";
import React from "react";
import { useColorModeValue } from "./ui/color-mode";
import {
  Box,
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

import Link from "@/components/link";
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
        <MobileMenuButton label="Menu" icon={<Bars3Icon />} onClick={onOpen} />
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
                bg={useColorModeValue("neutral.50", "neutralD.50")}
              >
                <Drawer.CloseTrigger />
                <Drawer.Header>Menu</Drawer.Header>
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
                        <Link href="https://twitter.com/wirtzdan/" isExternal unstyled>
                          <IconButton
                            aria-label="Twitter"
                            size="sm"
                            color={useColorModeValue("neutral.800", "neutralD.1000")}
                          >
                            <TwitterLogo weight="fill" />
                          </IconButton>
                        </Link>
                        <Link href="https://www.linkedin.com/in/wirtzdan/" isExternal unstyled>
                          <IconButton
                            aria-label="LinkedIn"
                            size="sm"
                            color={useColorModeValue("neutral.800", "neutralD.1000")}
                          >
                            <LinkedinLogo weight="fill" />
                          </IconButton>
                        </Link>
                        <Link href="https://github.com/wirtzdan" isExternal unstyled>
                          <IconButton
                            aria-label="GitHub"
                            size="sm"
                            color={useColorModeValue("neutral.800", "neutralD.1000")}
                          >
                            <GithubLogo weight="fill" />
                          </IconButton>
                        </Link>
                        <Link
                          href="https://www.youtube.com/channel/UCje_bQMr6F45x0Auii7IOvA"
                          unstyled
                          isExternal
                        >
                          <IconButton
                            aria-label="YouTube"
                            size="sm"
                            color={useColorModeValue("neutral.800", "neutralD.1000")}
                          >
                            <YoutubeLogo weight="fill" />
                          </IconButton>
                        </Link>
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
