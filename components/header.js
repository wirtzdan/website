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
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Container from "./container";
import { useRouter } from "next/router";
import ThemeToggle from "./theme-toggle";
import {
  BookmarkIcon,
  BookOpenIcon,
  BoltIcon,
} from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
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
    <NextLink href={href} passHref legacyBehavior>
      <Button
        aria-current={isActive ? "page" : undefined}
        variant="ghost"
        size="md"
        {...rest}
        _activeLink={{
          color: useColorModeValue("neutral.1100", "neutralD.1100"),
          bg: useColorModeValue("neutral.100", "neutralD.300"),
        }}
        _hover={{
          bg: useColorModeValue("neutral.200", "neutralD.200"),
        }}
        px={4}
      >
        {name}
      </Button>
    </NextLink>
  );
}

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const closeTimeoutRef = React.useRef();

  const delayedClose = () => {
    closeTimeoutRef.current = setTimeout(onClose, 200); // delay in ms
  };

  const cancelDelayedClose = () => {
    clearTimeout(closeTimeoutRef.current);
  };

  return (
    <Box
      bg={useColorModeValue("white", "neutralD.100")}
      display={{ base: "none", md: "block" }}
      position="fixed"
      w="100%"
      zIndex={99}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("neutral.400", "neutralD.400")}
      shadow="0 0 10px 0 rgba(0,0,0, 0.025);"
    >
      <Container>
        <VStack align="start" spacing={0}>
          <HStack justify="space-between" w="100%" h={16}>
            <AvatarNavigation />
            <HStack ml={-4} spacing={2}>
              <NavLink href="/blog" name="Blog" />
              <NavLink href="/about" name="About" />
              <Menu isOpen={isOpen} onClose={onClose}>
                <MenuButton
                  onMouseOver={onOpen}
                  onClick={isOpen ? onClose : onOpen}
                  onMouseLeave={delayedClose}
                  onMouseEnter={cancelDelayedClose}
                  as={Button}
                  rightIcon={<Icon as={ChevronDownIcon} />}
                  cursor="unset"
                  bg={useColorModeValue("white", "neutralD.100")}
                  _hover={{
                    bg: useColorModeValue("neutral.200", "neutralD.200"),
                  }}
                  _active={useColorModeValue("neutral.200", "neutralD.200")}
                >
                  Lists
                </MenuButton>
                <MenuList
                  bg={useColorModeValue("white", "neutralD.100")}
                  borderColor={useColorModeValue("neutral.400", "neutralD.400")}
                  onMouseLeave={onClose}
                  onMouseEnter={cancelDelayedClose}
                >
                  <Link href="/books" legacyBehavior>
                    <MenuItem
                      bg={useColorModeValue("white", "neutralD.100")}
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
                  <Link href="/bookmarks" legacyBehavior>
                    <MenuItem
                      bg={useColorModeValue("white", "neutralD.100")}
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
                  <Link href="/tools" legacyBehavior>
                    <MenuItem
                      bg={useColorModeValue("white", "neutralD.100")}
                      _hover={{
                        bg: useColorModeValue("neutral.200", "neutralD.200"),
                      }}
                    >
                      <HStack>
                        <Icon
                          as={BoltIcon}
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
