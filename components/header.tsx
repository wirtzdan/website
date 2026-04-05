import {
  Box,
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  BoltIcon,
  BookOpenIcon,
  BookmarkIcon,
} from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";

import AvatarNavigation from "./avatar-navigation";
import Container from "./container";
import ThemeToggle from "./theme-toggle";

interface NavLinkProps {
  href: string;
  name: string;
}

function NavLink({ href, name, ...rest }: NavLinkProps) {
  const { pathname } = useRouter();
  let isActive = false;

  if (href !== "/") {
    const [, group] = href.split("/");
    isActive = pathname.includes(group);
  } else if (href === pathname) {
    isActive = true;
  }

  return (
    <Button
      as={NextLink}
      href={href}
      aria-current={isActive ? "page" : undefined}
      variant="ghost"
      size="md"
      _activeLink={{
        color: useColorModeValue("neutral.1100", "neutralD.1100"),
        bg: useColorModeValue("neutral.100", "neutralD.300"),
      }}
      _hover={{
        bg: useColorModeValue("neutral.200", "neutralD.200"),
      }}
      px={4}
      {...rest}
    >
      {name}
    </Button>
  );
}

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
        <VStack align="start" spacing={0}>
          <HStack justify="space-between" w="100%" h={16}>
            <AvatarNavigation />
            <HStack ml={-4} spacing={2}>
              <NavLink href="/blog" name="Blog" />
              <NavLink href="/about" name="About" />
              <Menu isOpen={isOpen} onClose={onClose}>
                <MenuButton
                  as={Button}
                  onMouseOver={onOpen}
                  onClick={isOpen ? onClose : onOpen}
                  onMouseLeave={delayedClose}
                  onMouseEnter={cancelDelayedClose}
                  rightIcon={<Icon as={ChevronDownIcon} />}
                  cursor="default"
                  bg={menuBg}
                  _hover={{ bg: menuButtonHoverBg }}
                  _active={{ bg: menuButtonHoverBg }}
                >
                  Lists
                </MenuButton>
                <MenuList
                  bg={menuBg}
                  borderColor={menuBorderColor}
                  onMouseLeave={onClose}
                  onMouseEnter={cancelDelayedClose}
                >
                  <MenuItem
                    as={NextLink}
                    href="/books"
                    bg={menuBg}
                    _hover={{ bg: menuButtonHoverBg }}
                  >
                    <HStack>
                      <Icon as={BookOpenIcon} boxSize={4.5} color={menuIconColor} />
                      <Text>Books</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    as={NextLink}
                    href="/bookmarks"
                    bg={menuBg}
                    _hover={{ bg: menuButtonHoverBg }}
                  >
                    <HStack>
                      <Icon as={BookmarkIcon} boxSize={4.5} color={menuIconColor} />
                      <Text>Bookmarks</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    as={NextLink}
                    href="/tools"
                    bg={menuBg}
                    _hover={{ bg: menuButtonHoverBg }}
                  >
                    <HStack>
                      <Icon as={BoltIcon} boxSize={4.5} color={menuIconColor} />
                      <Text>Tools</Text>
                    </HStack>
                  </MenuItem>
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
