import React from "react";
import { format } from "timeago.js";
import {
  Box,
  VStack,
  Text,
  useColorModeValue,
  Tag,
  HStack,
  AspectRatio,
  Image,
  Icon,
  Divider,
  Center,
} from "@chakra-ui/react";
import { VideoCamera, BookOpen, PlayCircle } from "phosphor-react";
import Link from "@/components/link";
import readingTime from "reading-time";

const BlogCard = ({ slug, publishDate, summary, title, banner, type, mdx }) => {
  console.log("banner →", readingTime(mdx));
  return (
    <Link href={`/blog/${slug}`} unstyled>
      <VStack
        w="100%"
        // spacing={8}
        rounded="lg"
        borderWidth="1px"
        bg={useColorModeValue("white", "neutralD.100")}
        borderColor={useColorModeValue("neutral.400", "neutralD.400")}
        position="relative"
        align="center"
        px={4}
        p={4}
        spacing={4}
        transition="all 0.3s"
        transition-timing-function="spring(1 100 10 10)"
        _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
        height="100%"
        // height={48}
      >
        {banner ? (
          <Box position="relative" w="100%" rounded="lg">
            <AspectRatio
              ratio={1.85 / 1}
              w="100%"
              rounded="lg"
              overflow="hidden"
              borderWidth="1px"
              bg={useColorModeValue("white", "neutralD.100")}
              borderColor={useColorModeValue("neutral.400", "neutralD.400")}
            >
              <Image src={banner[0].url} objectFit="cover" />
            </AspectRatio>
            {type === "Video" ? (
              <Center
                position="absolute"
                top="0"
                bottom="0"
                left="0"
                right="0"
                // bg="rgb(0,0,0)"
                // bg="linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%)"
                transition="all 0.6s"
                transition-timing-function="spring(1 100 10 10)"
                // opacity={isHovered ? "1" : "0"}
              >
                <Icon
                  as={PlayCircle}
                  w={10}
                  h={10}
                  color={useColorModeValue("neutral.900", "neutral.900")}
                  weight="fill"
                  background="white"
                  rounded="full"
                  shadow="lg"
                />
              </Center>
            ) : undefined}
          </Box>
        ) : undefined}
        <VStack
          align="start"
          justifyContent="space-between"
          w="100%"
          h="100%"
          p={2}
          pt={0}
        >
          <VStack align="start">
            <HStack>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={useColorModeValue("neutral.1100", "neutralD.1100")}
              >
                {title}
              </Text>
            </HStack>
            <Text
              fontSize="sm"
              color={useColorModeValue("neutral.1000", "neutralD.1000")}
            >
              {summary}
            </Text>
          </VStack>

          <HStack
            fontSize="xs"
            fontWeight="500"
            spacing={1}
            color={useColorModeValue("neutral.900", "neutralD.900")}
          >
            {new Date() - new Date(publishDate) < 1000 * 60 * 60 * 24 * 7 ? (
              <Tag size="sm" colorScheme="green" mr={1}>
                New
              </Tag>
            ) : undefined}
            {type === "Video" ? (
              <HStack>
                <Icon as={VideoCamera} w={4} h={4} weight="duotone" />
                <Text>11 min video</Text>
              </HStack>
            ) : (
              <HStack spacing={1}>
                <Icon as={BookOpen} w={4} h={4} weight="duotone" />
                <Text>{readingTime(mdx).text}</Text>
              </HStack>
            )}
            {/* <Text>– {format(publishDate)}</Text> */}
          </HStack>
        </VStack>
      </VStack>
    </Link>

    // <VStack
    //   w="100%"
    //   rounded="lg"
    //   borderWidth="1px"
    //   bg={useColorModeValue("white", "neutralD.100")}
    //   borderColor={useColorModeValue("neutral.400", "neutralD.400")}
    //   transition="all 0.25s"
    //   transition-timing-function="spring(1 100 10 10)"
    //   _hover={{
    //     transform: "translateY(-4px)",
    //     shadow: "lg",
    //     textDecoration: "none",
    //   }}
    //   overflow="hidden"
    //   align="start"
    //   spacing={0}
    // >
    //   <Box position="relative" w="100%">
    //     <AspectRatio
    //       ratio={1.85 / 1}
    //       maxW="400px"
    //       w="100%"
    //       borderBottomWidth="1px"
    //       borderColor={useColorModeValue("neutral.400", "neutralD.400")}
    //     >
    //       <Image src={banner[0].url} objectFit="cover" />
    //     </AspectRatio>
    //     {/* <Center
    //         position="absolute"
    //         top="0"
    //         bottom="0"
    //         left="0"
    //         right="0"
    //         bg="rgb(0,0,0)"
    //         bg="linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%)"
    //         transition="all 0.6s"
    //         transition-timing-function="spring(1 100 10 10)"
    //         opacity={isHovered ? "1" : "0"}
    //       >
    //         <Icon as={Play} w={12} h={12} color="white" />
    //       </Center> */}
    //   </Box>

    //   <VStack py={2} px={4} spacing={0} align="start">
    //     <Text fontSize="sm" noOfLines={1} fontWeight="500">
    //       {title}
    //     </Text>
    //     <HStack spacing={1}>
    //       {/* <Text
    //         fontSize="xs"
    //         fontWeight="500"
    //         color={useColorModeValue("neutral.900", "neutralD.900")}
    //         textTransform="capitalize"
    //       >
    //         {type}
    //       </Text> */}
    //       {/* <Box bg="blue.500" rounded="full" p="2px" color="whites">
    //           <LinkOutline size="8"></LinkOutline>
    //         </Box> */}
    //       {/* <Text
    //         fontSize="xs"
    //         fontWeight="400"
    //         color={useColorModeValue("neutral.900", "neutralD.900")}
    //       >
    //         – {format(created)}
    //       </Text> */}
    //     </HStack>
    //   </VStack>
    // </VStack>
    // <Link href={`/blog/${slug}`}>
    //   <Box
    //     as="a"
    //     cursor="pointer"
    //     w="100%"
    //     transition="all 0.25s"
    //     transition-timing-function="spring(1 100 10 10)"
    //     _hover={{ transform: "translateY(-4px)", shadow: "sm" }}
    //   >
    //     <VStack
    //       align="start"
    //       p={6}
    //       bg={useColorModeValue("white", "neutralD.100")}
    //       rounded="lg"
    //       borderWidth="1px"
    //       borderColor={useColorModeValue("neutral.400", "neutralD.400")}
    //       spacing={0}
    //     >
    //       <HStack>
    //         <Text
    //           fontSize="xl"
    //           color={useColorModeValue("neutral.1100", "neutralD.1100")}
    //           pb={1}
    //         >
    //           {title}{" "}
    //           {new Date() - new Date(publishDate) < 1000 * 60 * 60 * 24 * 7 ? (
    //             <Tag size="md" mt={1} ml={1} colorScheme="green">
    //               New
    //             </Tag>
    //           ) : undefined}
    //         </Text>
    //       </HStack>

    //       <Text
    //         fontSize="md"
    //         color={useColorModeValue("neutral.900", "neutralD.900")}
    //       >
    //         {format(publishDate)}
    //       </Text>
    //     </VStack>
    //   </Box>
    // </Link>
  );
};

export default BlogCard;
