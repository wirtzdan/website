"use client";

import { useDisclosure } from "@/lib/use-disclosure";
import React from "react";
import { useColorModeValue } from "./ui/color-mode";
import { Box, Button, Drawer, Portal } from "@chakra-ui/react";
import { EnvelopeIcon, RssIcon } from "@heroicons/react/24/outline";

import MobileMenuButton from "./mobile-menu-button";
import SubscribeCard from "@/components/subscribe-card";

interface NewsletterDrawerProps {
  placement?: string;
}

const NewsletterDrawer = ({ placement }: NewsletterDrawerProps) => {
  const { open, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <Box>
      {placement === "blog" ? (
        <Button onClick={onOpen} colorPalette="purple">
          <RssIcon width={20} height={20} />
          Subscribe
        </Button>
      ) : (
        <MobileMenuButton label="Subscribe" icon={<EnvelopeIcon />} onClick={onOpen} />
      )}
      <Drawer.Root
        open={open}
        size="md"
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
              <Drawer.Content borderTopRadius="6px" bg={useColorModeValue("white", "neutralD.50")}>
                <Drawer.CloseTrigger />
                <Drawer.Header>Subscribe</Drawer.Header>
                <Drawer.Body pb={4}>
                  <SubscribeCard card={false} />
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Positioner>
          </Drawer.Backdrop>
        </Portal>
      </Drawer.Root>
    </Box>
  );
};

export default NewsletterDrawer;
