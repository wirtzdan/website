import React from "react";
import { Tag, WrapItem } from "@chakra-ui/react";

interface InterestTagProps {
  name: string;
  like?: boolean;
}

const InterestTag = ({ name, like }: InterestTagProps) => {
  return (
    <WrapItem>
      <Tag.Root size="lg" variant="subtle" colorPalette={like ? "green" : "red"} rounded="lg">
        {name}
      </Tag.Root>
    </WrapItem>
  );
};

export default InterestTag;
