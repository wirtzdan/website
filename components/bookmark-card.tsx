"use client";

import { useDisclosure } from "@/lib/use-disclosure";
import React from "react";
import { useColorModeValue } from "./ui/color-mode";
import {
  AspectRatio,
  Box,
  Center,
  Icon,
  Image,
  Text,
  VStack,
  HStack,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import { format } from "timeago.js";
import { ImageSquare } from "phosphor-react";
import ReactPlayer from "react-player/lazy";

interface BookmarkCardProps {
  title: string;
  excerpt?: string;
  cover: string;
  type: string;
  link: string;
  created: string;
}

const ImageFallback = () => {
  return (
    <Box bg={useColorModeValue("gray.200", "gray.700")}>
      <Icon w={10} h={10} color={useColorModeValue("gray.300", "neutralD.100")} asChild>
        <ImageSquare />
      </Icon>
    </Box>
  );
};

const BookmarkCard = ({ title, cover, type, link, created }: BookmarkCardProps) => {
  const { open, onClose } = useDisclosure();

  const handleClick = () => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <Box onClick={handleClick} cursor="pointer">
      <VStack
        w="100%"
        rounded="lg"
        borderWidth="1px"
        bg={useColorModeValue("white", "neutralD.100")}
        borderColor={useColorModeValue("neutral.400", "neutralD.400")}
        transition="all 0.25s"
        transitionTimingFunction="spring(1 100 10 10)"
        _hover={{
          transform: "translateY(-4px)",
          shadow: "lg",
          textDecoration: "none",
        }}
        overflow="hidden"
        align="start"
        gap={0}
      >
        <Box position="relative" w="100%">
          <AspectRatio
            ratio={1.85 / 1}
            maxW="400px"
            w="100%"
            borderBottomWidth="1px"
            borderColor={useColorModeValue("neutral.400", "neutralD.400")}
          >
            <Image src={cover} objectFit="cover" alt={title} />
          </AspectRatio>
        </Box>

        <VStack py={2} px={4} gap={0} align="start">
          <Text fontSize="sm" lineClamp={1} fontWeight="500">
            {title}
          </Text>
          <HStack gap={1}>
            <Text
              fontSize="xs"
              fontWeight="500"
              color={useColorModeValue("neutral.900", "neutralD.900")}
              textTransform="capitalize"
            >
              {type}
            </Text>
            <Text
              fontSize="xs"
              fontWeight="400"
              color={useColorModeValue("neutral.900", "neutralD.900")}
            >
              – {format(created)}
            </Text>
          </HStack>
        </VStack>
      </VStack>
      <Dialog.Root
        open={open}
        placement="center"
        onOpenChange={(e) => {
          if (!e.open) {
            onClose();
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content bg="none" maxW={type === "video" ? "auto" : "28rem"} w="auto">
              <Dialog.Body p={0} rounded="lg" overflow="hidden" bg="none">
                <Center>
                  {type === "image" ? (
                    <Image src={cover} rounded="lg" alt={title} />
                  ) : (
                    <ReactPlayer url={link} controls playing />
                  )}
                </Center>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
};

export default BookmarkCard;
