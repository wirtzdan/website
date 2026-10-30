"use client";
import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";

import Link from "@/components/link";
import type { AirtableImage } from "@/types/content";
import { toolIconUrl } from "@/lib/tool-icon";

import { cardLiftProps, cardStillProps } from "./card-lift";

interface ToolCardProps {
  name?: string;
  image?: AirtableImage[];
  link?: string;
  description?: string;
  platform?: string;
  isAffiliate?: boolean;
  tint?: string;
}

const ToolCard = ({ name, image, link = "#", description, tint }: ToolCardProps) => {
  const imageUrl = toolIconUrl(image);

  return (
    <Link href={link} unstyled>
      <Box {...cardStillProps}>
        <HStack
          {...cardLiftProps}
          p={4}
          bg={{ _light: "white", _dark: "neutralD.100" }}
          rounded="lg"
          borderWidth="1px"
          borderColor={{ _light: "neutral.400", _dark: "neutralD.400" }}
          w="100%"
          textAlign="left"
          align="start"
          gap={4}
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
              bg={tint}
              position="absolute"
              top={0}
              bottom={0}
              left={0}
              right={0}
              opacity={0.25}
            />

            {imageUrl ? (
              <Image
                src={imageUrl}
                boxSize="36px"
                rounded="md"
                position="relative"
                alt=""
                loading="lazy"
                decoding="async"
              />
            ) : (
              <Box boxSize="36px" rounded="md" position="relative" />
            )}
          </Box>

          <VStack align="start" justify="flex-start" gap={1} maxW="lg" h="100%">
            <VStack gap={0} align="start" flexGrow="1">
              <Text fontWeight="bold" fontSize="md" lineClamp={2}>
                {name}
              </Text>
              <Text fontSize="sm" color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}>
                {description}
              </Text>
            </VStack>
          </VStack>
        </HStack>
      </Box>
    </Link>
  );
};

export default ToolCard;
