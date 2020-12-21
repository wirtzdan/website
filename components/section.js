import React from "react";
import { Center } from "@chakra-ui/react";
import Container from "./container";

const Section = (props) => {
  console.log("🚀 ~ file: section.js ~ line 5 ~ Section ~ props", props);
  const { full, children, ...rest } = props;
  return (
    <Center as="section" {...rest} w="100%">
      {full ? children : <Container>{children}</Container>}
    </Center>
  );
};

export default Section;
