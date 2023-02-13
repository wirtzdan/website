import React from "react";
import { VStack, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import Section from "@/components/section";

const Hero = ({ title = "Title", subtitle, align = "center" }) => {
  return (
    <Section>
      <VStack align={align}>
        <Heading as="h1">{title}</Heading>
        {subtitle ? (
          <Text
            fontSize={["lg", "2xl"]}
            color={useColorModeValue("neutral.1000", "neutralD.1000")}
            maxW="lg"
            textAlign={align}
          >
            {subtitle}
          </Text>
        ) : undefined}
      </VStack>
    </Section>
  );
};

export default Hero;
