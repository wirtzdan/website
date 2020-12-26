import { MDXProvider } from "@mdx-js/react";
import { Box } from "@chakra-ui/react";
import MDXComponents from "./mdx-components";

export default function MDXCompProvider(props) {
  return (
    <MDXProvider components={MDXComponents}>
      <Box {...props} />
    </MDXProvider>
  );
}
