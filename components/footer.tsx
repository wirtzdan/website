"use client";
import type { ReactNode } from "react";
import { HStack, IconButton, Link as ChakraLink } from "@chakra-ui/react";
import { RiGithubFill, RiLinkedinFill, RiTwitterXFill, RiYoutubeFill } from "@remixicon/react";
import NextLink from "next/link";

import Container from "@/components/container";

interface FooterLinkProps {
  href: string;
  name: string;
}

const FooterLink = ({ href, name }: FooterLinkProps) => {
  return (
    <ChakraLink asChild variant="plain">
      <NextLink href={href}>{name}</NextLink>
    </ChakraLink>
  );
};

function SocialIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <IconButton asChild variant="ghost" size="sm" aria-label={label}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </IconButton>
  );
}

const Footer = () => {
  return (
    <Container>
      <HStack justify="space-between" w="100%" display={{ base: "none", md: "flex" }} my={8}>
        <FooterLink href="mailto:daniel@danielwirtz.com" name="Contact" />
        <HStack gap={4}>
          <SocialIconLink href="https://twitter.com/wirtzdan/" label="Twitter">
            <RiTwitterXFill />
          </SocialIconLink>
          <SocialIconLink href="https://www.linkedin.com/in/wirtzdan/" label="LinkedIn">
            <RiLinkedinFill />
          </SocialIconLink>
          <SocialIconLink href="https://github.com/wirtzdan" label="GitHub">
            <RiGithubFill />
          </SocialIconLink>
          <SocialIconLink
            href="https://www.youtube.com/channel/UCje_bQMr6F45x0Auii7IOvA"
            label="YouTube"
          >
            <RiYoutubeFill />
          </SocialIconLink>
        </HStack>
        <FooterLink href="/privacy" name="Privacy" />
      </HStack>
    </Container>
  );
};

export default Footer;
