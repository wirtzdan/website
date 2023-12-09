import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Avatar,
  HStack,
  VStack,
  Text,
  useColorModeValue,
  Divider,
  Tag,
  SimpleGrid,
  Button,
  Box,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

const AvatarNavigation = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <Link href="/" legacyBehavior>
      <Avatar
        name="Daniel Wirtz"
        size="sm"
        src="/avatar-small.jpg"
        cursor="pointer"
      />
    </Link>
  );
  {
    /* <Popover
    >
      <PopoverTrigger>
        <Avatar
          name="Daniel Wirtz"
          size="sm"
          src="/avatar-small.jpg"
          cursor="pointer"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          <VStack align="start" spacing={4}>
            <VStack align="left" spacing={1} w="100%" ml={-2}>
              <Text fontSize="sm" fontWeight="500" ml={2}>
                Projects
              </Text>
              <Link href="https://chrome.google.com/webstore/detail/roam-highlighter/hponfflfgcjikmehlcdcnpapicnljkkc?hl=en">
                <HStack
                  transition="all 0.25s"
                  transition-timing-function="spring(1 100 10 10)"
                  _hover={{
                    bg: useColorModeValue("gray.100", "gray.600"),
                  }}
                  px={2}
                  py={1}
                  rounded="lg"
                  w="100%"
                >
                  <Image
                    src="/roam-highlighter.png"
                    width={36}
                    height={36}
                  ></Image>
                  <VStack align="left" spacing={-1}>
                    <HStack>
                      <Text fontSize="md" fontWeight="bold">
                        Roam Highlighter
                      </Text>
                      <Tag size="sm" colorScheme="green">
                        V1
                      </Tag>
                    </HStack>
                    <Text fontSize="sm">Web Highlighter for Roam Research</Text>
                  </VStack>
                </HStack>
              </Link>
              <Link href="https://roamflow.co">
                <HStack
                  transition="all 0.25s"
                  transition-timing-function="spring(1 100 10 10)"
                  _hover={{
                    bg: useColorModeValue("gray.100", "gray.600"),
                  }}
                  px={2}
                  py={1}
                  rounded="lg"
                  w="100%"
                >
                  <Image src="/roamflow.png" width={36} height={36}></Image>
                  <VStack align="left" spacing={-1}>
                    <HStack>
                      <Text fontSize="md" fontWeight="bold">
                        Roamflow
                      </Text>
                      <Tag size="sm" colorScheme="purple">
                        Dev
                      </Tag>
                    </HStack>
                    <Text fontSize="sm">Supercharge Roam Research</Text>
                  </VStack>
                </HStack>
              </Link>
            </VStack>
            <Divider />
            <SimpleGrid columns={2} w="100%" spacing={2}>
              <Link href="https://twitter.com/wirtzdan">
                <Button size="sm">Twitter</Button>
              </Link>
              <Link href="https://github.com/wirtzdan">
                <Button size="sm">Github</Button>
              </Link>
              <Link href="mailto:danielwirtzx@gmail.com">
                <Button size="sm">Contact</Button>
              </Link>
              <Link>
                <Button size="sm" isDisabled>
                  Newsletter
                </Button>
              </Link>
            </SimpleGrid>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover> */
  }
};

export default AvatarNavigation;
