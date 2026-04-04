import React from "react";
import { HStack, Image, Text, VStack, useColorModeValue } from "@chakra-ui/react";

interface ExperienceCardProps {
  company: string;
  logo: string;
  role: string;
  date: string;
  description: string;
}

const ExperienceCard = ({ company, logo, role, date, description }: ExperienceCardProps) => {
  return (
    <VStack align="start" spacing={4}>
      <HStack spacing={4} align="start">
        <Image
          src={`/static/images/companies/${logo}.jpg`}
          alt={company}
          w={12}
          h={12}
          mt={1.5}
          rounded="lg"
        />
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">{company}</Text>
          <Text fontSize="md" color={useColorModeValue("gray.800", "gray.100")}>
            {description}
          </Text>
          <Text
            fontSize="sm"
            color={useColorModeValue("gray.600", "gray.200")}
            letterSpacing="wider"
          >
            {role} :: {date}
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default ExperienceCard;
