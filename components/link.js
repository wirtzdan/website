import React from "react";
import NextLink from "next/link";
import { chakra, useColorModeValue } from "@chakra-ui/react";

const Link = (props) => {
  const href = props.href;
  const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));

  return props.unstyled ? (
    isInternalLink ? (
      <NextLink href={href} legacyBehavior>
        <chakra.a {...props} />
      </NextLink>
    ) : (
      <chakra.a {...props} />
    )
  ) : isInternalLink ? (
    <NextLink href={href} legacyBehavior>
      <chakra.a
        fontWeight="400"
        color={useColorModeValue("primary.900", "primaryD.900")}
        transition="all 0.25s"
        transitionTimingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
        _hover={{
          color: useColorModeValue("primary.1000", "primaryD.1000"),
          textDecoration: "underline",
        }}
        {...props}
      />
    </NextLink>
  ) : (
    <chakra.a
      fontWeight="400"
      color={useColorModeValue("primary.900", "primaryD.900")}
      transition="all 0.25s"
      transitionTimingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        color: useColorModeValue("primary.1000", "primaryD.1000"),
        textDecoration: "underline",
      }}
      {...props}
    />
  );

  //   if (isInternalLink) {
  //     return (
  //       <NextLink href={href}>
  //         <chakra.a
  //           borderBottom="2px"
  //           borderRadius="1px"
  //           transition="all 0.3s"
  //           transitionTimingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
  //           borderColor={useColorModeValue("primaryD.200", "primary.200")}
  //           color={useColorModeValue("primaryD.200", "primary.600")}
  //           _hover={{
  //             borderColor: useColorModeValue("primaryD.200", "primary.200"),
  //             color: useColorModeValue("primaryD.200", "primary.200"),
  //             backgroundColor: useColorModeValue("primaryD.200", "primary.200"),
  //           }}
  //           {...props}
  //         />
  //       </NextLink>
  //     );
  //   } else {
  //     return (
  //       <chakra.a
  //         borderBottom="2px"
  //         borderRadius="1px"
  //         borderColor={useColorModeValue("primary.400", "primary.400")}
  //         color={useColorModeValue("primaryD.300", "primary.300")}
  //         transition="all 0.3s"
  //         transitionTimingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
  //         _hover={{
  //           color: useColorModeValue("primaryD.50", "primaryD.200"),
  //           backgroundColor: useColorModeValue("primary.400", "primary.400"),
  //         }}
  //         {...props}
  //       />
  //     );
  //   }
};

export default Link;
