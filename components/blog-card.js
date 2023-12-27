import React from "react";
import { format } from "timeago.js";
import {
  VStack,
  Text,
  useColorModeValue,
  HStack,
  Heading,
} from "@chakra-ui/react";
import Link from "@/components/link";
import readingTime from "reading-time";

const BlogCard = ({
  slug,
  publishDate,
  summary,
  title,
  banner,
  type,
  mdx,
  views,
  videoLength,
}) => {
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
        {/* {banner ? (
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
        <VStack
          align="start"
          justifyContent="space-between"
          w="100%"
          h="100%"
          p={1}
          pt={0}
        >
          <VStack align="start">
            <HStack>
              <Heading fontSize="xl" borderBottom="0">
                {title}
              </Heading>
            </HStack>
            {/* <Text
              fontSize="sm"
              color={useColorModeValue("neutral.1000", "neutralD.1000")}
            >
              {summary}
            </Text> */}
          </VStack>
          <HStack
            fontSize="sm"
            fontWeight="500"
            spacing={2}
            color={useColorModeValue("neutral.900", "neutralD.900")}
          >
            <Text>Posted {format(publishDate)}</Text>
            <Text>·</Text>
            {type === "Video" ? (
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
          {/*  <HStack
            fontSize="sm"
            fontWeight="500"
            spacing={3}
            color={useColorModeValue("neutral.900", "neutralD.900")}
          >
            {new Date() - new Date(publishDate) < 1000 * 60 * 60 * 24 * 7 ? (
              <Tag size="sm" colorScheme="green" mr={1}>
                New
              </Tag>
            ) : undefined}

            {type === "Video" ? (
              <HStack spacing={1}>
                <Icon as={ClockIcon} w={4} h={4} weight="duotone" />
                <Text>{videoLength} min video</Text>
              </HStack>
            ) : (
              <HStack spacing={1}>
                <Icon as={ClockIcon} w={4} h={4} weight="duotone" />
                <Text>{readingTime(mdx).text}</Text>
              </HStack>
            )}
            <HStack spacing={1}>
              <Icon as={EyeIcon} w={4} h={4} weight="duotone" />
              <Text>{views} views</Text>
            </HStack>
             <Text>– {format(publishDate)}</Text>
          </HStack> */}
        </VStack>
      </VStack>
    </Link>
  );
};

export default BlogCard;
