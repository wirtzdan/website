"use client";
import React from "react";
import { Box, Card, Image, Text, VStack } from "@chakra-ui/react";
import { usePalette } from "react-palette";

import Link from "@/components/link";
import type { AirtableImage } from "@/types/content";

interface ToolCardProps {
  name?: string;
  image?: AirtableImage[];
  link?: string;
  description?: string;
  platform?: string;
  isAffiliate?: boolean;
}

const ToolCard = ({ name, image, link = "#", description }: ToolCardProps) => {
  const imageUrl = image?.[0]?.thumbnails.large.url ?? "/";
  const { data } = usePalette(imageUrl);

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
        textAlign="left"
      >
        <Box
          rounded="lg"
          p={2}
          position="relative"
          overflow="hidden"
          lineHeight={0}
          boxShadow="inset 0 0 1px 1px rgba(0, 0, 0, 0.015)"
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

          <Image src={imageUrl} boxSize="36px" rounded="md" position="relative" alt={name} />
        </Box>

        <VStack align="start" justify="flex-start" gap={1} maxW="lg" h="100%">
          <VStack gap={0} align="start" flexGrow="1">
            <Text fontWeight="bold" fontSize="md" lineClamp={2}>
              {name}
            </Text>
            <Text fontSize="sm" color="fg">
              {description}
            </Text>
          </VStack>
        </VStack>
      </Card.Root>
    </Link>
  );
};

export default ToolCard;
