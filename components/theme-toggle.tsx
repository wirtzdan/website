"use client";
import { Icon, IconButton } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { useColorMode } from "./ui/color-mode";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

import MobileMenuButton from "./mobile-menu-button";

interface ThemeToggleProps {
  mobile?: boolean;
}

const ThemeToggle = ({ mobile = false }: ThemeToggleProps) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const icon =
    colorMode === "dark" ? (
      <Icon asChild>
        <SunIcon />
      </Icon>
    ) : (
      <Icon asChild>
        <MoonIcon />
      </Icon>
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
          onClick={toggleColorMode}
        >
          {icon}
        </IconButton>
      )}
    </Tooltip>
  );
};

export default ThemeToggle;
