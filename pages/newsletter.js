import React from "react";
import {
  VStack,
  HStack,
  Text,
  Heading,
  useColorModeValue,
  Input,
  FormControl,
  FormHelperText,
  Button,
  Box,
  Avatar,
} from "@chakra-ui/react";
import PageTransition from "../components/page-transitions";
import Section from "@/components/section";
import { RssIcon } from "@heroicons/react/solid";

export default function Newsletter() {
  return (
    <PageTransition>
      <Section>
        <VStack spacing={8}>
          <VStack spacing={16}>
            <VStack spacing={4}>
              <Heading as="h1">Dan's Journal</Heading>
              <Text
                fontSize="2xl"
                color={useColorModeValue("gray.500", "gray.200")}
                maxW="lg"
                textAlign="center"
              >
                The most interesing things I'm reading and finding around the
                web.
              </Text>
              <HStack spacing={4}>
                <FormControl w="100%">
                  <Input
                    name="email_address"
                    placeholder="you@email.com"
                    type="email"
                    minW="3xs"
                    // ref={register({ required: true })}
                    // isDisabled={isSuccessful}
                    // isLoading={isSubmitSuccessful}
                    bg={useColorModeValue("white", "neutralD.100")}
                    rounded="lg"
                  />
                  {/* <FormHelperText>Send max. once per month</FormHelperText> */}
                  {/* {errors.author && (
                  <FormErrorMessage>"E-Mail is required"</FormErrorMessage>
                )} */}
                </FormControl>
                <Button
                  mt={4}
                  colorScheme="purple"
                  type="submit"
                  w="100%"
                  // isDisabled={isSuccessful}
                  // isLoading={isSubmitting}
                  leftIcon={<RssIcon size={20} />}
                  rounded="lg"
                >
                  Subscribe
                </Button>
              </HStack>
            </VStack>
            <VStack w="100%">
              <Text
                fontSize="md"
                color={useColorModeValue("gray.500", "gray.400")}
              >
                ↓ Scroll through the latest issue ↓
              </Text>
              <Box
                border="1px solid"
                borderColor={useColorModeValue("gray.200", "gray.700")}
                w="100%"
                rounded="lg"
                overflow="hidden"
              >
                <Box
                  w="100%"
                  bg={useColorModeValue("gray.100", "neutralD.100")}
                >
                  <HStack p={4} fontSize="sm" spacing={4}>
                    <Avatar src="/avatar-small.jpg" h={8} w={8}></Avatar>
                    <VStack spacing={0} alignItems="left">
                      <Text>
                        <Text
                          as="span"
                          color={useColorModeValue("gray.600", "gray.400")}
                          fontWeight="500"
                        >
                          From:
                        </Text>{" "}
                        Daniel Wirtz
                      </Text>
                      <Text>
                        <Text
                          as="span"
                          color={useColorModeValue("gray.600", "gray.400")}
                          fontWeight="500"
                        >
                          To:
                        </Text>{" "}
                        you@email.com
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
                <Box h="500px" w="100%" bg="white">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://buttondown.email/letters-to-j/archive/026-pain-as-a-scalar?as_embed=true"
                  ></iframe>
                  <iframe
                    width="100%"
                    height="100%"
                    // scrolling="no"
                    // style="width:100%!important;height:220px;border:1px #ccc solid !important"
                    src="https://buttondown.email/dansjournal?as_embed=true"
                  ></iframe>
                </Box>
              </Box>
            </VStack>
          </VStack>
        </VStack>
      </Section>
    </PageTransition>
  );
}
