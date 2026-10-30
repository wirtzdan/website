"use client";
import React from "react";
import { HStack, Image, Text, VStack } from "@chakra-ui/react";

interface ExperienceCardProps {
  company: string;
  logo: string;
  role: string;
  date: string;
  description: string;
}

const ExperienceCard = ({ company, logo, role, date, description }: ExperienceCardProps) => {
  return (
    <VStack align="start" gap={4}>
      <HStack gap={4} align="start">
        <Image
          src={`/static/images/companies/${logo}.jpg`}
          alt={company}
          w={12}
          h={12}
          mt={1.5}
          rounded="lg"
        />
        <VStack align="start" gap={2}>
          <Text fontWeight="bold">{company}</Text>
          <Text fontSize="md" color={{ _light: "neutral.1100", _dark: "neutralD.1100" }}>
            {description}
          </Text>
          <Text
            fontSize="sm"
            color={{ _light: "neutral.1000", _dark: "neutralD.1000" }}
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
