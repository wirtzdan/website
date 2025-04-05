import React from "react";
import {
  IconButton,
  Icon,
  useColorMode,
  ScaleFade,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
/* import useSound from "use-sound"; */
import MobileMenuButton from "./mobile-menu-button";

const ThemeToggle = ({ mobile }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  /* const [play] = useSound("/lightswitch.mp3", {
    volume: 0.05,
    sprite: {
      on: [0, 300],
      off: [500, 300],
    },
  }); */

  const handleClick = () => {
    toggleColorMode();
    /* colorMode === "dark" ? play({ id: "on" }) : play({ id: "off" }); */
  };

  return (
    <Tooltip
      label={colorMode === "dark" ? "Light mode" : "Dark mode"}
      aria-label="A tooltip"
    >
      {mobile ? (
        <MobileMenuButton
          label={colorMode === "dark" ? "Light Mode" : "Dark Mode"}
          icon={
            colorMode === "dark" ? (
              <Icon as={SunIcon} />
            ) : (
              <Icon as={MoonIcon} />
            )
          }
          onClick={handleClick}
        ></MobileMenuButton>
      ) : (
        <IconButton
          isRound
          aria-label="Switch theme"
          variant={mobile ? "ghost" : undefined}
          icon={
            colorMode === "dark" ? (
              <Icon as={SunIcon} />
            ) : (
              <Icon as={MoonIcon} />
            )
          }
          onClick={handleClick}
        />
      )}
    </Tooltip>
  );
};
export default ThemeToggle;
