"use client";
import { IconButton } from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "./ui/color-mode";
import { Tooltip } from "@/components/ui/tooltip";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

import MobileMenuButton from "./mobile-menu-button";

interface ThemeToggleProps {
  mobile?: boolean;
}

const ThemeToggle = ({ mobile = false }: ThemeToggleProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const iconColor = useColorModeValue("neutral.1100", "neutralD.1100");

  // Raw icons with explicit size so mobile nav matches Blog/Menu (~20px).
  const icon =
    colorMode === "dark" ? (
      <SunIcon width={20} height={20} />
    ) : (
      <MoonIcon width={20} height={20} />
    );

  return (
    <Tooltip
      content={colorMode === "dark" ? "Light mode" : "Dark mode"}
      aria-label="Theme mode tooltip"
    >
      {mobile ? (
        <MobileMenuButton
          label={colorMode === "dark" ? "Light Mode" : "Dark Mode"}
          icon={icon}
          onClick={toggleColorMode}
        />
      ) : (
        <IconButton
          variant="ghost"
          borderRadius="full"
          aria-label="Switch theme"
          color={iconColor}
          onClick={toggleColorMode}
        >
          {icon}
        </IconButton>
      )}
    </Tooltip>
  );
};

export default ThemeToggle;
