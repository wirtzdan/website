import React from "react";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  useDisclosure,
  Input,
  Button,
  VStack,
  FormControl,
  Alert,
  AlertIcon,
  FormLabel,
  FormHelperText,
  Textarea,
  Tooltip,
  SimpleGrid,
  useColorModeValue,
  Divider,
  HStack,
} from "@chakra-ui/react";
import {
  GithubLogo,
  LinkedinLogo,
  TwitterLogo,
  YoutubeLogo,
} from "phosphor-react";
import { EnvelopeIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import MobileMenuButton from "./mobile-menu-button";
import MobileMenuItem from "./mobile-menu-item";
import ThemeToggle from "./theme-toggle";
import Link from "@/components/link";

const MobileMenuToggle = ({ mobile }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const {
    register,
    handleSubmit,
    watch,

    formState: {
      isSubmitting,
      isSubmitSuccessful,
      errors,
    },
  } = useForm();
  const onSubmit = async (data) => {
    await sendSuggestion(data);
  };

  return (
    <Box>
      <Tooltip label="Newsletter">
        <MobileMenuButton label="Menu" icon={<Bars3Icon />} onClick={onOpen} />
      </Tooltip>
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay>
          <DrawerContent
            borderTopRadius="6px"
            bg={useColorModeValue("neutral.50", "neutralD.50")}
          >
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
                    <Link
                      href="https://twitter.com/wirtzdan/"
                      isExternal
                      unstyled
                    >
                      <IconButton
                        size="sm"
                        icon={<TwitterLogo weight="fill" />}
                        color={useColorModeValue(
                          "neutral.800",
                          "neutralD.1000"
                        )}
                      ></IconButton>
                    </Link>
                    <Link
                      href="https://www.linkedin.com/in/wirtzdan/"
                      isExternal
                      unstyled
                    >
                      <IconButton
                        size="sm"
                        icon={<LinkedinLogo weight="fill" />}
                        color={useColorModeValue(
                          "neutral.800",
                          "neutralD.1000"
                        )}
                      ></IconButton>
                    </Link>
                    <Link
                      href="https://github.com/wirtzdan"
                      isExternal
                      unstyled
                    >
                      <IconButton
                        size="sm"
                        icon={<GithubLogo weight="fill" />}
                        color={useColorModeValue(
                          "neutral.800",
                          "neutralD.1000"
                        )}
                      ></IconButton>
                    </Link>
                    <Link
                      href="https://www.youtube.com/channel/UCje_bQMr6F45x0Auii7IOvA"
                      unstyled
                      isExternal
                    >
                      <IconButton
                        size="sm"
                        icon={<YoutubeLogo weight="fill" />}
                        color={useColorModeValue(
                          "neutral.800",
                          "neutralD.1000"
                        )}
                      ></IconButton>
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
