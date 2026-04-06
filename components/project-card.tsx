"use client";
import React from "react";
import { Box, Card, HStack, Tag, Text, VStack } from "@chakra-ui/react";
import { usePalette } from "react-palette";

import Image from "./image";
import Link from "@/components/link";
import type { AirtableImage } from "@/types/content";

interface ProjectCardProps {
  name?: string;
  description?: string;
  logo?: AirtableImage[];
  link?: string;
  type?: string;
}

const getTypeColor = (type?: string) => {
  if (type === "Web App") return "teal";
  if (type === "Extension") return "blue";
  if (type === "Community") return "orange";
  return "gray";
};

const ProjectCard = ({ name, description, logo, link = "#", type }: ProjectCardProps) => {
  const logoUrl = logo?.[0]?.thumbnails.large.url ?? "/";
  const { data } = usePalette(logoUrl);

  return (
    <Link href={link} unstyled>
      <Card.Root
        variant="outline"
        interactive
        size="sm"
        display="flex"
        flexDirection="row"
        alignItems="stretch"
        gap={4}
        p={4}
        w="100%"
        h="100%"
        textAlign="left"
      >
        <Box
          rounded="lg"
          p={2}
          position="relative"
          overflow="hidden"
          lineHeight={0}
          boxShadow="inset 0 0 1px 1px rgba(0, 0, 0, 0.04)"
        >
          <Box
            bg={data.lightVibrant}
            position="absolute"
            top={0}
            bottom={0}
            left={0}
            right={0}
            opacity={0.25}
          />
          <Image
            src={logoUrl}
            height={36}
            width={36}
            alt={name ?? "Project logo"}
            style={{ borderRadius: "0.375rem" }}
          />
        </Box>

        <VStack align="start" justify="flex-start" gap={1}>
          <VStack gap={0} align="start">
            <HStack>
              <Text fontWeight="bold" fontSize="md" lineClamp={2}>
                {name}
              </Text>
              <Tag.Root size="sm" colorPalette={getTypeColor(type)}>
                {type}
              </Tag.Root>
            </HStack>

            <Text fontSize="sm" color="fg.muted">
              {description}
            </Text>
          </VStack>
        </VStack>
      </Card.Root>
    </Link>
  );
};

export default ProjectCard;
