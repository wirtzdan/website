import React from "react";
import {
  chakra,
  VStack,
  HStack,
  Button,
  IconButton,
  useColorMode,
  Text,
  Divider,
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

  return (
    <NextLink href={href} passHref>
      <Button variant="ghost" {...rest}>
        {name}
      </Button>
    </NextLink>
  );
}

const Header = () => {
  return (
    <Container>
      <VStack align="start" spacing={4} display={{ base: "none", md: "flex" }}>
        <NextLink href="/" passHref>
          <chakra.a display="block" aria-label="Home">
            <Text fontSize="3xl" fontWeight="bold">
              Daniel Wirtz
            </Text>
          </chakra.a>
        </NextLink>
        <HStack justify="space-between" w="100%">
          <HStack ml={-4}>
            <NavLink href="/blog" name="Blog" />
            <NavLink href="/about" name="About" />
            <NavLink href="/books" name="Books" />
          </HStack>
          <ThemeToggle />
        </HStack>
        <Divider />
      </VStack>
    </Container>
  );
};
export default Header;
