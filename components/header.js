import React from "react";
import {
  chakra,
  VStack,
  HStack,
  Button,
  IconButton,
  useColorMode,
  Text,
  Box,
  Divider,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuCommand,
  MenuDivider,
  Icon,
  Avatar,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Container from "./container";
import { useRouter } from "next/router";
import ThemeToggle from "./theme-toggle";
import {
  BookmarkIcon,
  BookOpenIcon,
  ChevronDownIcon,
  LightningBoltIcon,
  MenuIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import AvatarNavigation from "./avatar-navigation";

function NavLink(props) {
  const { href, name, ...rest } = props;
  var isActive = false;
  const { pathname } = useRouter();

  if (href !== "/") {
    const [, group] = href.split("/");

    isActive = pathname.includes(group);
  } else {
    if (href === pathname) {
      isActive = true;
    }
  }

  return (
    <NextLink href={href} passHref>
      <Button
        aria-current={isActive ? "page" : undefined}
        variant="ghost"
        size="md"
        {...rest}
        _activeLink={{
          color: useColorModeValue("neutral.1100", "neutralD.1100"),
          bg: useColorModeValue("neutral.200", "neutralD.300"),
        }}
        _hover={{
          bg: useColorModeValue("neutral.200", "neutralD.200"),
        }}
        px={8}
      >
        {name}
      </Button>
    </NextLink>
  );
}

const Header = () => {
  return (
    <Box
      bg={useColorModeValue("white", "neutralD.100")}
      display={{ base: "none", md: "block" }}
      position="fixed"
      w="100%"
      zIndex={99}
      borderBottomWidth="2px"
      borderBottomColor={useColorModeValue("neutral.400", "neutralD.400")}
      shadow="0 0 10px 0 rgba(0,0,0, 0.035);"
    >
      <Container>
        <VStack align="start" spacing={0}>
          <HStack justify="space-between" w="100%" h={16}>
            <AvatarNavigation />
            <HStack ml={-4} spacing={2}>
              <NavLink href="/about" name="About" />
              <NavLink href="/blog" name="Blog" />
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  size="md"
                  px={6}
                  rightIcon={<ChevronDownIcon size={18} />}
                  _hover={{
                    bg: useColorModeValue("neutral.200", "neutralD.200"),
                  }}
                >
                  Links
                </MenuButton>
                <MenuList
                  bg={useColorModeValue("white", "neutralD.100")}
                  borderColor={useColorModeValue("neutral.400", "neutralD.400")}
                >
                  <Link href="/books">
                    <MenuItem
                      _hover={{
                        bg: useColorModeValue("neutral.200", "neutralD.200"),
                      }}
                    >
                      <HStack>
                        <Icon
                          as={BookOpenIcon}
                          size={18}
                          color={useColorModeValue("blue.500", "blue.200")}
                        />
                        <Text>Books</Text>
                      </HStack>
                    </MenuItem>
                  </Link>
                  <Link href="/bookmarks">
                    <MenuItem
                      _hover={{
                        bg: useColorModeValue("neutral.200", "neutralD.200"),
                      }}
                    >
                      <HStack>
                        <Icon
                          as={BookmarkIcon}
                          size={18}
                          color={useColorModeValue("blue.500", "blue.200")}
                        />
                        <Text>Bookmarks</Text>
                      </HStack>
                    </MenuItem>
                  </Link>
                  <Link href="/tools">
                    <MenuItem
                      _hover={{
                        bg: useColorModeValue("neutral.200", "neutralD.200"),
                      }}
                    >
                      <HStack>
                        <Icon
                          as={LightningBoltIcon}
                          size={18}
                          color={useColorModeValue("blue.500", "blue.200")}
                        />
                        <Text>Tools</Text>
                      </HStack>
                    </MenuItem>
                  </Link>
                </MenuList>
              </Menu>
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
