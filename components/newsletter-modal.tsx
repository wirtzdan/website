import React from "react";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

import SubscribeCard from "@/components/subscribe-card";

const NewsletterModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        Subscribe
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Box p={6} pl={0}>
              <SubscribeCard card={false} title="Stay in the loop" />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewsletterModal;
