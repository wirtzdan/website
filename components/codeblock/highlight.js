import { chakra, useColorMode, useColorModeValue } from "@chakra-ui/react";
import BaseHighlight, { defaultProps } from "prism-react-renderer";
import { prismDark, prismLight } from "./themes";

import React from "react";

const RE = /{([\d,-]+)}/;

const calculateLinesToHighlight = (meta) => {
  if (!RE.test(meta)) {
    return () => false;
  }

  const lineNumbers = RE.exec(meta)[1]
    .split(`,`)
    .map((v) => v.split(`-`).map((x) => parseInt(x, 10)));

  return (index) => {
    const lineNumber = index;
    const inRange = lineNumbers.some(([start, end]) =>
      end ? lineNumber >= start && lineNumber <= end : lineNumber === start
    );
    return inRange;
  };
};

function Highlight({
  codeString,
  language,
  metastring,
  showLines,
  ln,
  ...props
}) {
  const baseTheme = useColorModeValue(prismLight, prismDark);

  const { colorMode } = useColorMode();

  const customTheme = {
    ...baseTheme,
    plain: {
      ...baseTheme.plain,
      fontFamily: "Fira Code",
      fontSize: "14px",
      lineHeight: "26px",
    },
  };

  const shouldHighlightLine = calculateLinesToHighlight(ln);

  return (
    <BaseHighlight
      {...defaultProps}
      code={codeString}
      language={language}
      theme={customTheme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <chakra.div data-language={language} py={2} overflowX="auto">
          <pre className={className} style={style}>
            {tokens.splice(0, tokens.length - 1).map((line, i) => {
              const lineProps = getLineProps({ line, key: i });
              return (
                <chakra.div
                  px={4}
                  mr={4}
                  bg={
                    shouldHighlightLine(i)
                      ? colorMode === "light"
                        ? "blue.50"
                        : "blue.800"
                      : undefined
                  }
                  boxShadow={
                    shouldHighlightLine(i)
                      ? colorMode === "light"
                        ? "inset 3px 0px 0px 0px #4299E1"
                        : "inset 3px 0px 0px 0px #90CDF4"
                      : undefined
                  }
                  _hover={{
                    bg: colorMode === "light" ? "gray.50" : "gray.700",
                  }}
                  {...lineProps}
                >
                  {showLines && (
                    <chakra.span opacity={0.5} mr={4} fontSize="xs">
                      {i + 1}
                    </chakra.span>
                  )}
                  {line.map((token, key) => (
                    <chakra.span {...getTokenProps({ token, key })} />
                  ))}
                </chakra.div>
              );
            })}
          </pre>
        </chakra.div>
      )}
    </BaseHighlight>
  );
}

export default Highlight;
