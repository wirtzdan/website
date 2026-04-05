import React from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { EnvelopeIcon, RssIcon } from "@heroicons/react/24/outline";

import MobileMenuButton from "./mobile-menu-button";
import SubscribeCard from "@/components/subscribe-card";

interface NewsletterDrawerProps {
  placement?: string;
}

const NewsletterDrawer = ({ placement }: NewsletterDrawerProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <Box>
      {placement === "blog" ? (
        <Button leftIcon={<RssIcon width={20} height={20} />} onClick={onOpen} colorScheme="purple">
          Subscribe
        </Button>
      ) : (
        <MobileMenuButton label="Subscribe" icon={<EnvelopeIcon />} onClick={onOpen} />
      )}
      <Drawer isOpen={isOpen} size="md" placement="bottom" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay>
          <DrawerContent borderTopRadius="6px" bg={useColorModeValue("white", "neutralD.50")}>
            <DrawerCloseButton />
            <DrawerHeader>Subscribe</DrawerHeader>
            <DrawerBody pb={4}>
              <SubscribeCard card={false} />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default NewsletterDrawer;
