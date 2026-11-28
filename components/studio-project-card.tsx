"use client";

import { Badge, Heading, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";

import Link from "@/components/link";
import { displayHost, type Project, withUtm } from "@/lib/projects";

function OutboundLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} isExternal display="inline-flex" alignItems="center" gap={0.5}>
      {children}
      <Icon boxSize={4} asChild aria-hidden>
        <ArrowUpRightIcon />
      </Icon>
      <Text as="span" srOnly>
        (opens in a new tab)
      </Text>
    </Link>
  );
}

/** One studio project. `compact` is the shorter homepage row. */
export default function StudioProjectCard({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  const { name, url, blurb, status, install } = project;

  return (
    <VStack
      as="article"
      align="start"
      gap={compact ? 1 : 2}
      w="100%"
      rounded="lg"
      borderWidth="1px"
      bg={{ _light: "white", _dark: "neutralD.100" }}
      borderColor={{ _light: "neutral.400", _dark: "neutralD.400" }}
      p={compact ? 4 : 6}
    >
      <HStack gap={2} align="center">
        <Heading as="h3" fontSize="lg" fontWeight="500">
          {name}
        </Heading>
        {status ? (
          <Badge size="sm" variant="subtle">
            {status}
          </Badge>
        ) : null}
      </HStack>
      <Text color={{ _light: "neutral.1100", _dark: "neutralD.1100" }}>{blurb}</Text>
      <HStack gap={4} fontSize="sm" wrap="wrap" mt={compact ? 0 : 1}>
        <OutboundLink href={withUtm(url)}>{displayHost(url)}</OutboundLink>
        {install && !compact ? (
          <OutboundLink href={install.url}>{install.label}</OutboundLink>
        ) : null}
      </HStack>
    </VStack>
  );
}
