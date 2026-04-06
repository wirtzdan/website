"use client";

import React from "react";
import { Box, HStack, Tag, Text, VStack, useColorModeValue } from "@chakra-ui/react";
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
      <HStack
        p={4}
        bg={useColorModeValue("white", "neutralD.100")}
        rounded="lg"
        borderWidth="1px"
        borderColor={useColorModeValue("neutral.400", "neutralD.400")}
        w="100%"
        h="100%"
        textAlign="left"
        align="start"
        spacing={4}
        transition="all 0.25s"
        transitionTimingFunction="spring(1 100 10 10)"
        _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
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

        <VStack align="start" justify="flex-start" spacing={1}>
          <VStack spacing={0} align="start">
            <HStack>
              <Text fontWeight="bold" fontSize="md" noOfLines={2}>
                {name}
              </Text>
              <Tag size="sm" colorScheme={getTypeColor(type)}>
                {type}
              </Tag>
            </HStack>

            <Text fontSize="sm" color={useColorModeValue("neutral.1000", "neutralD.1000")}>
              {description}
            </Text>
          </VStack>
        </VStack>
      </HStack>
    </Link>
  );
};

export default ProjectCard;
