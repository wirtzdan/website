import { Heading, Text, VStack, type StackProps, useColorModeValue } from "@chakra-ui/react";

import Section from "@/components/section";

interface HeroProps extends StackProps {
  title?: string;
  subtitle?: string;
  align?: "start" | "center" | "end";
}

const Hero = ({ title = "Title", subtitle, align = "center", ...sectionProps }: HeroProps) => {
  return (
    <Section {...sectionProps}>
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
        ) : null}
      </VStack>
    </Section>
  );
};

export default Hero;
