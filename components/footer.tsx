"use client";
import { Button, HStack, IconButton } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";
import { GithubLogo, LinkedinLogo, TwitterLogo, YoutubeLogo } from "phosphor-react";
import NextLink from "next/link";

import Container from "@/components/container";
import Link from "@/components/link";

interface FooterLinkProps {
  href: string;
  name: string;
}

const FooterLink = ({ href, name }: FooterLinkProps) => {
  return (
    <Button
      color={useColorModeValue("neutral.800", "neutralD.800")}
      _hover={{ color: useColorModeValue("neutral.1000", "neutralD.1000") }}
      unstyled
      asChild
    >
      <NextLink href={href}>{name}</NextLink>
    </Button>
  );
};

const Footer = () => {
  return (
    <Container>
      <HStack justify="space-between" w="100%" display={{ base: "none", md: "flex" }} my={8}>
        <FooterLink href="mailto:daniel@danielwirtz.com" name="Contact" />
        <HStack gap={4}>
          <Link href="https://twitter.com/wirtzdan/" isExternal unstyled>
            <IconButton
              size="sm"
              aria-label="Twitter"
              color={useColorModeValue("neutral.800", "neutralD.1000")}
            >
              <TwitterLogo weight="fill" />
            </IconButton>
          </Link>
          <Link href="https://www.linkedin.com/in/wirtzdan/" isExternal unstyled>
            <IconButton
              size="sm"
              aria-label="LinkedIn"
              color={useColorModeValue("neutral.800", "neutralD.1000")}
            >
              <LinkedinLogo weight="fill" />
            </IconButton>
          </Link>
          <Link href="https://github.com/wirtzdan" isExternal unstyled>
            <IconButton
              size="sm"
              aria-label="GitHub"
              color={useColorModeValue("neutral.800", "neutralD.1000")}
            >
              <GithubLogo weight="fill" />
            </IconButton>
          </Link>
          <Link href="https://www.youtube.com/channel/UCje_bQMr6F45x0Auii7IOvA" isExternal unstyled>
            <IconButton
              size="sm"
              aria-label="YouTube"
              color={useColorModeValue("neutral.800", "neutralD.1000")}
            >
              <YoutubeLogo weight="fill" />
            </IconButton>
          </Link>
        </HStack>
        <FooterLink href="/privacy" name="Privacy" />
      </HStack>
    </Container>
  );
};

export default Footer;
