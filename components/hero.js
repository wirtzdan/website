import React from "react";
import { VStack, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import Section from "@/components/section";

const Hero = ({ title = "Title", subtitle }) => {
  return (
    <Section>
      <VStack>
        <Heading as="h1">{title}</Heading>
        {subtitle ? (
          <Text
            fontSize={["lg", "xl"]}
            color={useColorModeValue("neutral.1000", "neutralD.1000")}
            maxW="lg"
            textAlign="center"
          >
            {subtitle}
          </Text>
        ) : undefined}
      </VStack>
    </Section>
  );
};

export default Hero;
