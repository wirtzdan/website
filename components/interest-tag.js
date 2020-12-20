import React from "react";
import { Box, Tag, WrapItem } from "@chakra-ui/react";

const InterestTag = ({ name, like }) => {
  return (
    <WrapItem>
      <Tag size="lg" variant="subtle" colorScheme={like ? "green" : "red"}>
        {name}
      </Tag>
    </WrapItem>
  );
};

export default InterestTag;
