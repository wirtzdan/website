"use client";
import { Button, HStack, IconButton } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";
import { GithubLogo, LinkedinLogo, TwitterLogo, YoutubeLogo } from "phosphor-react";
import NextLink from "next/link";

import Container from "@/components/container";

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
          <IconButton
            asChild
            size="sm"
            variant="ghost"
            aria-label="Twitter"
            color={useColorModeValue("neutral.1000", "neutralD.1000")}
          >
            <a href="https://twitter.com/wirtzdan/" target="_blank" rel="noopener noreferrer">
              <TwitterLogo weight="fill" />
            </a>
          </IconButton>
          <IconButton
            asChild
            size="sm"
            variant="ghost"
            aria-label="LinkedIn"
            color={useColorModeValue("neutral.1000", "neutralD.1000")}
          >
            <a
              href="https://www.linkedin.com/in/wirtzdan/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedinLogo weight="fill" />
            </a>
          </IconButton>
          <IconButton
            asChild
            size="sm"
            variant="ghost"
            aria-label="GitHub"
            color={useColorModeValue("neutral.1000", "neutralD.1000")}
          >
            <a href="https://github.com/wirtzdan" target="_blank" rel="noopener noreferrer">
              <GithubLogo weight="fill" />
            </a>
          </IconButton>
          <IconButton
            asChild
            size="sm"
            variant="ghost"
            aria-label="YouTube"
            color={useColorModeValue("neutral.1000", "neutralD.1000")}
          >
            <a
              href="https://www.youtube.com/channel/UCje_bQMr6F45x0Auii7IOvA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <YoutubeLogo weight="fill" />
            </a>
          </IconButton>
        </HStack>
        <FooterLink href="/privacy" name="Privacy" />
      </HStack>
    </Container>
  );
};

export default Footer;
