import Link from "next/link";
import Image from "next/image";
import Tweet from "react-tweet-embed";

import {
  Alert,
  Box,
  chakra,
  HTMLChakraProps,
  Kbd,
  useColorModeValue,
} from "@chakra-ui/react";

const CustomLink = (props) => {
  const href = props.href;
  const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));

  if (isInternalLink) {
    return (
      <Link href={href}>
        <a {...props} />
      </Link>
    );
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
};

const InlineCode = () => (
  <chakra.code
    apply="mdx.code"
    color={useColorModeValue("purple.500", "purple.200")}
    {...props}
  />
);

const Pre = (props) => <chakra.div my="2em" borderRadius="sm" {...props} />;

const MDXComponents = {
  h1: (props) => <chakra.h1 apply="mdx.h1" {...props} />,
  h2: (props) => <chakra.h2 apply="mdx.h2" {...props} />,
  h3: (props) => <chakra.h3 apply="mdx.h3" {...props} />,
  h4: (props) => <chakra.h4 apply="mdx.h4" {...props} />,
  hr: (props) => <chakra.hr apply="mdx.hr" {...props} />,
  strong: (props) => <Box as="strong" fontWeight="semibold" {...props} />,
  inlineCode: InlineCode,
  pre: Pre,
  kbd: Kbd,
  br: (props) => <Box height="24px" {...props} />,
  a: (props) => <chakra.a apply="mdx.a" {...props} />,
  p: (props) => <chakra.p apply="mdx.p" {...props} />,
  ul: (props) => <chakra.ul apply="mdx.ul" {...props} />,
  ol: (props) => <chakra.ol apply="mdx.ul" {...props} />,
  li: (props) => <chakra.li pb="4px" {...props} />,
  Image,
  a: CustomLink,
  Tweet,
};

export default MDXComponents;
