import React from "react";
import { Tag, WrapItem } from "@chakra-ui/react";

interface InterestTagProps {
  name: string;
  like?: boolean;
}

const InterestTag = ({ name, like }: InterestTagProps) => {
  return (
    <WrapItem>
      <Tag size="lg" variant="subtle" colorScheme={like ? "green" : "red"} rounded="lg">
        {name}
      </Tag>
    </WrapItem>
  );
};

export default InterestTag;
