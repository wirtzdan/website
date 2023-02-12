import React from "react";
import {
  HStack,
  VStack,
  Text,
  useColorModeValue,
  Tag,
  TagLabel,
  TagRightIcon,
  Box,
  AspectRatio,
  Image,
} from "@chakra-ui/react";
// import Image from "./image";
import { usePalette } from "react-palette";
import Link from "@/components/link";

const ToolCard = ({
  name,
  platform,
  image,
  link,
  isAffiliate,
  description,
}) => {
  const { data, loading, error } = usePalette(image[0].thumbnails.large.url);

  return (
    <Link href={link} unstyled>
      <HStack
        p={4}
        bg={useColorModeValue("white", "neutralD.100")}
        rounded="lg"
        borderWidth="1px"
        borderColor={useColorModeValue("neutral.400", "neutralD.400")}
        w="100%"
        textAlign="left"
        align="start"
        spacing={4}
        transition="all 0.25s"
        transition-timing-function="spring(1 100 10 10)"
        _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
      >
        <Box
          rounded="lg"
          p={2}
          position="relative"
          overflow="hidden"
          lineHeight={0}
          rounded="lg"
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
          ></Box>

          <Image
            src={image ? image[0].thumbnails.large.url : "/"}
            boxSize="36px"
            rounded="md"
            position="relative"
          ></Image>
        </Box>

        <VStack
          align="start"
          justify="flex-start"
          spacing={1}
          maxW="lg"
          h="100%"
        >
          <VStack spacing={0} align="start" flexGrow="1">
            <Text fontWeight="bold" fontSize="md" noOfLines={2}>
              {name}
            </Text>
            <Text
              fontSize="sm"
              color={useColorModeValue("neutral.900", "neutralD.900")}
            >
              {description}
            </Text>
          </VStack>
        </VStack>
      </HStack>
    </Link>
  );
};

export default ToolCard;
