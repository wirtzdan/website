"use client";

import React from "react";
import { Box, Button, useDisclosure, Dialog, Portal } from "@chakra-ui/react";

import SubscribeCard from "@/components/subscribe-card";

const NewsletterModal = () => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} colorPalette="blue">
        Subscribe
      </Button>
      <Dialog.Root
        open={open}
        motionPreset="slide-in-bottom"
        size="xl"
        onOpenChange={(e) => {
          if (!e.open) {
            onClose();
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.CloseTrigger />
              <Dialog.Body>
                <Box p={6} pl={0}>
                  <SubscribeCard card={false} title="Stay in the loop" />
                </Box>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default NewsletterModal;
