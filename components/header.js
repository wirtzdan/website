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
} from "@chakra-ui/react";
import NextLink from "next/link";
import Container from "./container";
import { useRouter } from "next/router";
import ThemeToggle from "./theme-toggle";

function NavLink(props) {
  const { href, name, ...rest } = props;
  const { pathname } = useRouter();

  const [, group] = href.split("/");
  const isActive = pathname.includes(group);
  console.log("🚀 ~ file: header.js ~ line 24 ~ NavLink ~ isActive", isActive);

  return (
    <NextLink href={href} passHref>
      <Button
        aria-current={isActive ? "page" : undefined}
        variant="ghost"
        size="md"
        {...rest}
        _activeLink={{
          color: useColorModeValue("blue.500", "blue.200"),
        }}
        px={4}
      >
        {name}
      </Button>
    </NextLink>
  );
}

const Header = () => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      display={{ base: "none", md: "block" }}
    >
      <Container py={2}>
        <VStack align="start" spacing={0}>
          {/* <NextLink href="/" passHref>
            <chakra.a display="block" aria-label="Home">
              <Text fontSize="2xl" fontWeight="bold">
                Daniel Wirtz
              </Text>
            </chakra.a>
          </NextLink> */}
          <HStack justify="space-between" w="100%">
            <HStack ml={-4} spacing={2}>
              <NavLink href="/" name="Home" />
              <NavLink href="/about" name="About" />
              <NavLink href="/blog" name="Blog" />
              <NavLink href="/books" name="Books" />
            </HStack>
            <ThemeToggle />
          </HStack>
        </VStack>
      </Container>
      <Divider />
    </Box>
  );
};
export default Header;
