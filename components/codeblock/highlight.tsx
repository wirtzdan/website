"use client";

import React from "react";
import { chakra } from "@chakra-ui/react";
import { Highlight as BaseHighlight } from "prism-react-renderer";

import { useColorMode } from "../ui/color-mode";

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
  const { colorMode } = useColorMode();
  const baseTheme = (colorMode === "dark" ? prismDark : prismLight) as never;

  const shouldHighlightLine = calculateLinesToHighlight(ln);

  return (
    <BaseHighlight code={codeString} language={language} theme={baseTheme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <chakra.div data-language={language} overflowX="auto">
          <pre className={className} style={style}>
            {tokens.map((line, index) => {
              const lineProps = getLineProps({ line, key: index });

              return (
                <chakra.div
                  key={`line-${index}`}
                  {...lineProps}
                  bg={shouldHighlightLine(index) ? "rgba(255, 255, 255, 0.1)" : undefined}
                >
                  {showLines && (
                    <chakra.span opacity={0.5} mr={4} fontSize="xs">
                      {index + 1}
                    </chakra.span>
                  )}
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
