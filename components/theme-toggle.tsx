import { Icon, IconButton, Tooltip, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

import MobileMenuButton from "./mobile-menu-button";

interface ThemeToggleProps {
  mobile?: boolean;
}

const ThemeToggle = ({ mobile = false }: ThemeToggleProps) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const icon = colorMode === "dark" ? <Icon as={SunIcon} /> : <Icon as={MoonIcon} />;

  return (
    <Tooltip
      label={colorMode === "dark" ? "Light mode" : "Dark mode"}
      aria-label="Theme mode tooltip"
    >
      {mobile ? (
        <MobileMenuButton
          label={colorMode === "dark" ? "Light Mode" : "Dark Mode"}
          icon={icon}
          onClick={toggleColorMode}
        />
      ) : (
        <IconButton isRound aria-label="Switch theme" icon={icon} onClick={toggleColorMode} />
      )}
    </Tooltip>
  );
};

export default ThemeToggle;
