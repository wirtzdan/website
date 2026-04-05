import React from "react";
import { chakra, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { Highlight as BaseHighlight } from "prism-react-renderer";

import { prismDark, prismLight } from "./themes";

const RE = /{([\d,-]+)}/;

const calculateLinesToHighlight = (meta?: string) => {
  if (!meta || !RE.test(meta)) {
    return () => false;
  }

  const lineNumbers = RE.exec(meta)?.[1]
    .split(",")
    .map((value) => value.split("-").map((entry) => Number.parseInt(entry, 10)));

  return (index: number) => {
    const lineNumber = index;
    return (
      lineNumbers?.some(([start, end]) =>
        end ? lineNumber >= start && lineNumber <= end : lineNumber === start,
      ) ?? false
    );
  };
};

interface HighlightProps {
  codeString: string;
  language: string;
  showLines?: boolean;
  ln?: string;
}

function Highlight({ codeString, language, showLines = false, ln }: HighlightProps) {
  const baseTheme = useColorModeValue(prismLight, prismDark);
  const { colorMode } = useColorMode();

  const shouldHighlightLine = calculateLinesToHighlight(ln);

  return (
    <BaseHighlight code={codeString} language={language} theme={baseTheme as never}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <chakra.div data-language={language} overflowX="auto">
          <pre className={className} style={style}>
            {tokens.map((line, index) => {
              const lineProps = getLineProps({ line, key: index });

              return (
                <chakra.div
                  key={index}
                  px={2}
                  mr={4}
                  bg={
                    shouldHighlightLine(index)
                      ? colorMode === "light"
                        ? "blue.50"
                        : "blue.800"
                      : undefined
                  }
                  boxShadow={
                    shouldHighlightLine(index)
                      ? colorMode === "light"
                        ? "inset 3px 0px 0px 0px #4299E1"
                        : "inset 3px 0px 0px 0px #90CDF4"
                      : undefined
                  }
                  _hover={{
                    bg: colorMode === "light" ? "neutral.100" : "neutralD.200",
                  }}
                  {...lineProps}
                >
                  {showLines ? (
                    <chakra.span opacity={0.5} mr={4} fontSize="xs">
                      {index + 1}
                    </chakra.span>
                  ) : null}
                  {line.map((token, tokenIndex) => (
                    <chakra.span key={tokenIndex} {...getTokenProps({ token, key: tokenIndex })} />
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
