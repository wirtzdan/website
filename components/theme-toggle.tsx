"use client";
import { Box, IconButton } from "@chakra-ui/react";
import type { CSSProperties } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

import { Tooltip } from "@/components/ui/tooltip";

import MobileMenuButton from "./mobile-menu-button";
import { useColorMode } from "./ui/color-mode";

interface ThemeToggleProps {
  mobile?: boolean;
}

const iconStyle = { display: "block" } as const;

const ThemeIcon = ({ style }: { style?: CSSProperties }) => (
  <Box boxSize="20px" style={style}>
    <Box display={{ base: "block", _dark: "none" }}>
      <MoonIcon width={20} height={20} style={iconStyle} />
    </Box>
    <Box display={{ base: "none", _dark: "block" }}>
      <SunIcon width={20} height={20} style={iconStyle} />
    </Box>
  </Box>
);

const ModeLabel = ({ light, dark }: { light: string; dark: string }) => (
  <>
    <Box as="span" display={{ base: "inline", _dark: "none" }}>
      {light}
    </Box>
    <Box as="span" display={{ base: "none", _dark: "inline" }}>
      {dark}
    </Box>
  </>
);

const ThemeToggle = ({ mobile = false }: ThemeToggleProps) => {
  const { toggleColorMode } = useColorMode();

  return (
    <Tooltip content={<ModeLabel light="Dark mode" dark="Light mode" />}>
      {mobile ? (
        <MobileMenuButton
          label={<ModeLabel light="Dark Mode" dark="Light Mode" />}
          icon={<ThemeIcon />}
          onClick={toggleColorMode}
        />
      ) : (
        <IconButton
          variant="ghost"
          borderRadius="full"
          aria-label="Switch theme"
          color={{ _light: "neutral.1100", _dark: "neutralD.1100" }}
          onClick={toggleColorMode}
        >
          <ThemeIcon />
        </IconButton>
      )}
    </Tooltip>
  );
};

export default ThemeToggle;
