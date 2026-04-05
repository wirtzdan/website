import React from "react";
import {
  AspectRatio,
  Box,
  Center,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  useDisclosure,
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
      <Icon w={10} h={10} as={ImageSquare} color={useColorModeValue("gray.300", "neutralD.100")} />
    </Box>
  );
};

const BookmarkCard = ({ title, cover, type, link, created }: BookmarkCardProps) => {
  const { isOpen, onClose } = useDisclosure();

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
        spacing={0}
      >
        <Box position="relative" w="100%">
          <AspectRatio
            ratio={1.85 / 1}
            maxW="400px"
            w="100%"
            borderBottomWidth="1px"
            borderColor={useColorModeValue("neutral.400", "neutralD.400")}
          >
            <Image src={cover} fallback={<ImageFallback />} objectFit="cover" alt={title} />
          </AspectRatio>
        </Box>

        <VStack py={2} px={4} spacing={0} align="start">
          <Text fontSize="sm" noOfLines={1} fontWeight="500">
            {title}
          </Text>
          <HStack spacing={1}>
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
      <Modal isOpen={isOpen} onClose={onClose} isCentered allowPinchZoom>
        <ModalOverlay />
        <ModalContent bg="none" maxW={type === "video" ? "auto" : "28rem"} w="auto">
          <ModalBody p={0} rounded="lg" overflow="hidden" bg="none">
            <Center>
              {type === "image" ? (
                <Image src={cover} rounded="lg" alt={title} />
              ) : (
                <ReactPlayer url={link} controls playing />
              )}
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BookmarkCard;
