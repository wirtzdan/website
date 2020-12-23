import React from "react";
import { HStack, Button, useColorMode, Text } from "@chakra-ui/react";
import Container from "../components/container";
import NextLink from "next/link";

const Footer = () => {
  const date = new Date().getFullYear();

  function FooterLink(props) {
    const { href, name, ...rest } = props;

    return (
      <NextLink href={href} passHref>
        <Button variant="unstyled" {...rest}>
          {name}
        </Button>
      </NextLink>
    );
  }

  return (
    <Container>
      <HStack
        justify="space-between"
        w="100%"
        display={{ base: "none", md: "flex" }}
      >
        <Text>© {date} Daniel Wirtz </Text>
        <HStack spacing={4}>
          <FooterLink href="/disclaimer" name="Disclaimer" />
          <FooterLink href="/privacy" name="Privacy" />
        </HStack>
      </HStack>
    </Container>
  );
};
export default Footer;
