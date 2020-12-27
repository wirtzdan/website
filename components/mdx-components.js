import Link from "next/link";
import NextImage from "next/image";
import Tweet from "react-tweet-embed";
// import Codeblock from "@/components/codeblock";
import {
  Alert,
  Box,
  chakra,
  Code,
  HTMLChakraProps,
  Kbd,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

const Table = (props) => (
  <chakra.div overflowX="auto">
    <chakra.table textAlign="left" mt="32px" width="full" {...props} />
  </chakra.div>
);

const THead = (props) => (
  <chakra.th
    bg={useColorModeValue("gray.50", "whiteAlpha.100")}
    fontWeight="semibold"
    p={2}
    fontSize="sm"
    {...props}
  />
);

const TData = (props) => (
  <chakra.td
    p={2}
    borderTopWidth="1px"
    borderColor="inherit"
    fontSize="sm"
    whiteSpace="normal"
    {...props}
  />
);

const CustomLink = (props) => {
  const href = props.href;
  const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));

  if (isInternalLink) {
    return (
      <Box color={useColorMode("blue.500", "blue.200")}>
        <Link href={href}>
          <a apply="mdx.a" {...props} />
        </Link>
      </Box>
    );
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
};

const Image = (props) => {
  return (
    <Box mt={4} rounded="lg" shadow="sm" overflow="hidden" lineHeight={0}>
      <NextImage {...props} />
    </Box>
  );
};

const InlineCode = (props) => (
  <Code
    apply="mdx.code"
    bg={useColorModeValue("gray.200", "gray.700")}
    rounded="md"
    fontWeight="bold"
    {...props}
  />
);

const Codeblock = (props) => (
  <Box
    apply="mdx.code"
    borderWidth="1px"
    borderColor={useColorModeValue("gray.100", "gray.800")}
    bg={useColorModeValue("gray.800", "gray.200")}
    color={useColorModeValue("white", "gray.800")}
    rounded="md"
    p={4}
    {...props}
  />
);

const CustomFigure = (props) => {
  <Text></Text>;
};

// const Pre = (props) => <chakra.div my="2em" borderRadius="sm" {...props} />;

const MDXComponents = {
  h1: (props) => <chakra.h1 apply="mdx.h1" {...props} />,
  h2: (props) => <chakra.h2 apply="mdx.h2" mt={8} {...props} />,
  h3: (props) => <chakra.h3 apply="mdx.h3" {...props} />,
  h4: (props) => <chakra.h4 apply="mdx.h4" {...props} />,
  hr: (props) => <chakra.hr apply="mdx.hr" {...props} />,
  strong: (props) => <Box as="strong" fontWeight="semibold" {...props} />,
  inlineCode: InlineCode,
  // code: InlineCode,
  // pre: Codeblock,
  pre: Codeblock,
  kbd: Kbd,
  blockquote: (props) => (
    <Alert
      mt="4"
      role="none"
      status="info"
      variant="left-accent"
      as="blockquote"
      rounded="4px"
      my="1.5rem"
      bg={useColorModeValue("blue.50", "gray.800")}
      fontWeight="500"
      {...props}
    />
  ),
  table: Table,
  th: THead,
  td: TData,
  br: (props) => <Box height="24px" {...props} />,
  a: (props) => <chakra.a apply="mdx.a" {...props} />,
  p: (props) => <chakra.p apply="mdx.p" {...props} />,
  ul: (props) => <chakra.ul apply="mdx.ul" {...props} />,
  ol: (props) => <chakra.ol apply="mdx.ul" {...props} />,
  li: (props) => <chakra.li pb="4px" {...props} />,
  Image,
  // a: CustomLink,
  Tweet,
};

export default MDXComponents;
