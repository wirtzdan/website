import React from "react";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  Tooltip,
  SimpleGrid,
  useColorModeValue,
  Divider,
  HStack,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { GithubLogo, LinkedinLogo, TwitterLogo, YoutubeLogo } from "phosphor-react";
import { Bars3Icon } from "@heroicons/react/24/solid";

import Link from "@/components/link";
import MobileMenuButton from "./mobile-menu-button";
import MobileMenuItem from "./mobile-menu-item";

interface MobileMenuToggleProps {
  mobile?: boolean;
}

const MobileMenuToggle = ({ mobile }: MobileMenuToggleProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <Box>
      <Tooltip label="Newsletter">
        <MobileMenuButton label="Menu" icon={<Bars3Icon />} onClick={onOpen} />
      </Tooltip>
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay>
          <DrawerContent borderTopRadius="6px" bg={useColorModeValue("neutral.50", "neutralD.50")}>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody pb={4}>
              <VStack spacing={4}>
                <VStack w="100%">
                  <MobileMenuItem href="/" title="Home" />
                  <SimpleGrid columns={1} spacing={2} w="100%">
                    <MobileMenuItem href="/about" title="About" />
                    <MobileMenuItem href="/blog" title="Blog" />
                    <MobileMenuItem href="/bookmarks" title="Bookmarks" />
                    <MobileMenuItem href="/books" title="Books" />
                    <MobileMenuItem href="/tools" title="Tools" />
                  </SimpleGrid>
                </VStack>

                <Divider />
                <HStack justifyContent="center" w="100%">
                  <HStack spacing={2}>
                    <Link href="https://twitter.com/wirtzdan/" isExternal unstyled>
                      <IconButton
                        aria-label="Twitter"
                        size="sm"
                        icon={<TwitterLogo weight="fill" />}
                        color={useColorModeValue("neutral.800", "neutralD.1000")}
                      />
                    </Link>
                    <Link href="https://www.linkedin.com/in/wirtzdan/" isExternal unstyled>
                      <IconButton
                        aria-label="LinkedIn"
                        size="sm"
                        icon={<LinkedinLogo weight="fill" />}
                        color={useColorModeValue("neutral.800", "neutralD.1000")}
                      />
                    </Link>
                    <Link href="https://github.com/wirtzdan" isExternal unstyled>
                      <IconButton
                        aria-label="GitHub"
                        size="sm"
                        icon={<GithubLogo weight="fill" />}
                        color={useColorModeValue("neutral.800", "neutralD.1000")}
                      />
                    </Link>
                    <Link
                      href="https://www.youtube.com/channel/UCje_bQMr6F45x0Auii7IOvA"
                      unstyled
                      isExternal
                    >
                      <IconButton
                        aria-label="YouTube"
                        size="sm"
                        icon={<YoutubeLogo weight="fill" />}
                        color={useColorModeValue("neutral.800", "neutralD.1000")}
                      />
                    </Link>
                  </HStack>
                </HStack>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default MobileMenuToggle;
