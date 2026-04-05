import { Button, HStack, IconButton, useColorModeValue } from "@chakra-ui/react";
import { GithubLogo, LinkedinLogo, TwitterLogo, YoutubeLogo } from "phosphor-react";

import Container from "@/components/container";
import Link from "@/components/link";

interface FooterLinkProps {
  href: string;
  name: string;
}

const FooterLink = ({ href, name }: FooterLinkProps) => {
  return (
    <Button
      as={Link}
      href={href}
      variant="unstyled"
      color={useColorModeValue("neutral.800", "neutralD.800")}
      _hover={{ color: useColorModeValue("neutral.1000", "neutralD.1000") }}
    >
      {name}
    </Button>
  );
};

const Footer = () => {
  return (
    <Container>
      <HStack
        justify="space-between"
        w="100%"
        display={{ base: "none", md: "flex" }}
        my={8}
      >
        <FooterLink href="mailto:daniel@danielwirtz.com" name="Contact" />
        <HStack spacing={4}>
          <Link href="https://twitter.com/wirtzdan/" isExternal unstyled>
            <IconButton
              size="sm"
              aria-label="Twitter"
              icon={<TwitterLogo weight="fill" />}
              color={useColorModeValue("neutral.800", "neutralD.1000")}
            />
          </Link>
          <Link href="https://www.linkedin.com/in/wirtzdan/" isExternal unstyled>
            <IconButton
              size="sm"
              aria-label="LinkedIn"
              icon={<LinkedinLogo weight="fill" />}
              color={useColorModeValue("neutral.800", "neutralD.1000")}
            />
          </Link>
          <Link href="https://github.com/wirtzdan" isExternal unstyled>
            <IconButton
              size="sm"
              aria-label="GitHub"
              icon={<GithubLogo weight="fill" />}
              color={useColorModeValue("neutral.800", "neutralD.1000")}
            />
          </Link>
          <Link
            href="https://www.youtube.com/channel/UCje_bQMr6F45x0Auii7IOvA"
            isExternal
            unstyled
          >
            <IconButton
              size="sm"
              aria-label="YouTube"
              icon={<YoutubeLogo weight="fill" />}
              color={useColorModeValue("neutral.800", "neutralD.1000")}
            />
          </Link>
        </HStack>
        <FooterLink href="/privacy" name="Privacy" />
      </HStack>
    </Container>
  );
};

export default Footer;
