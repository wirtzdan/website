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
  Heading,
} from "@chakra-ui/react";
import {
  BookOpenIcon,
  EyeIcon,
  VideoCameraIcon,
  PlayIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import Link from "@/components/link";
import readingTime from "reading-time";

const BlogListItem = ({
  slug,
  publishDate,
  excerpt,
  title,
  coverImage,
  // type,
  mdx,
  // views,
  // videoLength,
  videoLink,
}) => {
  return (
    <Link href={`/blog/${slug}`} unstyled>
      <HStack
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
        <VStack
          align="start"
          justifyContent="space-between"
          w="100%"
          h="100%"
          p={2}
          spacing={0}
        >
          <VStack align="start">
            <HStack>
              <Heading fontSize="lg" borderBottom="0" fontWeight="500">
                {title}
              </Heading>
            </HStack>
          </VStack>
          <HStack
            fontSize="sm"
            fontWeight="400"
            spacing={2}
            color={useColorModeValue("neutral.900", "neutralD.900")}
          >
            <Text>Posted {format(publishDate)}</Text>
            <Text>·</Text>
            {videoLink ? (
              <HStack spacing={1}>
                {/* <Icon as={ClockIcon} w={4} h={4} weight="duotone" /> */}
                <Text>Video</Text>
              </HStack>
            ) : (
              <HStack spacing={1}>
                {/* <Icon as={ClockIcon} w={4} h={4} weight="duotone" /> */}
                <Text>Article</Text>
              </HStack>
            )}
          </HStack>
        </VStack>
        {/* {banner ? (
          <Box position="relative" w="25%" rounded="lg">
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
                  as={PlayIcon}
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
        ) : undefined} */}
      </HStack>
    </Link>
  );
};

export default BlogListItem;
