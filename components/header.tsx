"use client";
import { Box, Button, HStack, Icon, Menu, Text, VStack, Portal } from "@chakra-ui/react";
import { RiArrowDownSFill, RiBookOpenFill, RiBookmarkFill, RiToolsFill } from "@remixicon/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import AvatarNavigation from "./avatar-navigation";
import Container from "./container";
import ThemeToggle from "./theme-toggle";

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
      px={4}
      {...rest}
      asChild
    >
      <NextLink href={href}>{name}</NextLink>
    </Button>
  );
}

const Header = () => {
  return (
    <Box
      bg="bg"
      display={{ base: "none", md: "block" }}
      position="fixed"
      w="100%"
      zIndex={99}
      borderBottomWidth="1px"
      borderBottomColor="border"
      shadow="0 0 10px 0 rgba(0,0,0, 0.025);"
    >
      <Container>
        <VStack align="start" gap={0}>
          <HStack justify="space-between" w="100%" h={16}>
            <AvatarNavigation />
            <HStack ml={-4} gap={2}>
              <NavLink href="/blog" name="Blog" />
              <NavLink href="/about" name="About" />
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button variant="ghost">
                    Lists
                    <Icon asChild>
                      <RiArrowDownSFill />
                    </Icon>
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item value="item-0" asChild>
                        <NextLink href="/books">
                          <HStack>
                            <Icon boxSize={4.5} asChild>
                              <RiBookOpenFill />
                            </Icon>
                            <Text>Books</Text>
                          </HStack>
                        </NextLink>
                      </Menu.Item>
                      <Menu.Item value="item-1" asChild>
                        <NextLink href="/bookmarks">
                          <HStack>
                            <Icon boxSize={4.5} asChild>
                              <RiBookmarkFill />
                            </Icon>
                            <Text>Bookmarks</Text>
                          </HStack>
                        </NextLink>
                      </Menu.Item>
                      <Menu.Item value="item-2" asChild>
                        <NextLink href="/tools">
                          <HStack>
                            <Icon boxSize={4.5} asChild>
                              <RiToolsFill />
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
