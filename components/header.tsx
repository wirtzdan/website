"use client";
import { Box, Button, HStack, Icon, Menu, Text, VStack, Portal } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";
import { BoltIcon, BookOpenIcon, BookmarkIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

import AvatarNavigation from "./avatar-navigation";
import Container from "./container";
import ThemeToggle from "./theme-toggle";
import { useDisclosure } from "@/lib/use-disclosure";

interface NavLinkProps {
  href: string;
  name: string;
}

function NavLink({ href, name, ...rest }: NavLinkProps) {
  const pathname = usePathname();
  let isActive = false;

  if (href !== "/") {
    const [, group] = href.split("/");
    isActive = pathname.includes(group);
  } else if (href === pathname) {
    isActive = true;
  }

  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      variant="ghost"
      size="md"
      _currentPage={{
        color: useColorModeValue("neutral.1100", "neutralD.1100"),
        bg: useColorModeValue("neutral.100", "neutralD.300"),
      }}
      _hover={{
        bg: useColorModeValue("neutral.200", "neutralD.200"),
      }}
      px={4}
      {...rest}
      asChild
    >
      <NextLink href={href}>{name}</NextLink>
    </Button>
  );
}

const Header = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const delayedClose = () => {
    closeTimeoutRef.current = setTimeout(onClose, 200);
  };

  const cancelDelayedClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  const menuButtonHoverBg = useColorModeValue("neutral.200", "neutralD.200");
  const menuBg = useColorModeValue("white", "neutralD.100");
  const menuBorderColor = useColorModeValue("neutral.400", "neutralD.400");
  const menuIconColor = useColorModeValue("blue.500", "blue.200");

  return (
    <Box
      bg={menuBg}
      display={{ base: "none", md: "block" }}
      position="fixed"
      w="100%"
      zIndex={99}
      borderBottomWidth="1px"
      borderBottomColor={menuBorderColor}
      shadow="0 0 10px 0 rgba(0,0,0, 0.025);"
    >
      <Container>
        <VStack align="start" gap={0}>
          <HStack justify="space-between" w="100%" h={16}>
            <AvatarNavigation />
            <HStack ml={-4} gap={2}>
              <NavLink href="/blog" name="Blog" />
              <NavLink href="/about" name="About" />
              <Menu.Root
                open={open}
                onOpenChange={(details) => {
                  if (details.open) {
                    onOpen();
                  } else {
                    onClose();
                  }
                }}
              >
                <Menu.Trigger asChild>
                  <Button
                    onMouseOver={onOpen}
                    onClick={open ? onClose : onOpen}
                    onMouseLeave={delayedClose}
                    onMouseEnter={cancelDelayedClose}
                    cursor="default"
                    bg={menuBg}
                    _hover={{ bg: menuButtonHoverBg }}
                    _active={{ bg: menuButtonHoverBg }}
                  >
                    Lists
                    <Icon asChild>
                      <ChevronDownIcon />
                    </Icon>
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item
                        bg={menuBg}
                        _hover={{ bg: menuButtonHoverBg }}
                        value="item-0"
                        asChild
                      >
                        <NextLink href="/books">
                          <HStack>
                            <Icon boxSize={4.5} color={menuIconColor} asChild>
                              <BookOpenIcon />
                            </Icon>
                            <Text>Books</Text>
                          </HStack>
                        </NextLink>
                      </Menu.Item>
                      <Menu.Item
                        bg={menuBg}
                        _hover={{ bg: menuButtonHoverBg }}
                        value="item-1"
                        asChild
                      >
                        <NextLink href="/bookmarks">
                          <HStack>
                            <Icon boxSize={4.5} color={menuIconColor} asChild>
                              <BookmarkIcon />
                            </Icon>
                            <Text>Bookmarks</Text>
                          </HStack>
                        </NextLink>
                      </Menu.Item>
                      <Menu.Item
                        bg={menuBg}
                        _hover={{ bg: menuButtonHoverBg }}
                        value="item-2"
                        asChild
                      >
                        <NextLink href="/tools">
                          <HStack>
                            <Icon boxSize={4.5} color={menuIconColor} asChild>
                              <BoltIcon />
                            </Icon>
                            <Text>Tools</Text>
                          </HStack>
                        </NextLink>
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </HStack>
            <HStack>
              <ThemeToggle />
            </HStack>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Header;
