"use client";
import React from "react";
import { Box, Button, Drawer, useDisclosure, Portal } from "@chakra-ui/react";
import { RiMailLine, RiRssLine } from "@remixicon/react";

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
          <RiRssLine size={20} />
          Subscribe
        </Button>
      ) : (
        <MobileMenuButton label="Subscribe" icon={<RiMailLine />} onClick={onOpen} />
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
              <Drawer.Content borderTopRadius="6px">
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
