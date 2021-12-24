import React from "react";
import {
  IconButton,
  Icon,
  useColorMode,
  ScaleFade,
  Tooltip,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@heroicons/react/outline";
import useSound from "use-sound";
import MobileMenuButton from "./mobile-menu-button";

const ThemeToggle = ({ mobile }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [play] = useSound("/lightswitch.mp3", {
    volume: 0.05,
    sprite: {
      on: [0, 300],
      off: [500, 300],
    },
  });

  const handleClick = () => {
    toggleColorMode();
    colorMode === "dark" ? play({ id: "on" }) : play({ id: "off" });
  };

  return (
    <Tooltip
      label={colorMode === "dark" ? "Light mode" : "Dark mode"}
      aria-label="A tooltip"
    >
      {mobile ? (
        <MobileMenuButton
          label={colorMode === "dark" ? "Light Mode" : "Dark Mode"}
          // icon={
          //   colorMode === "dark" ? (
          //     <ScaleFade in>
          //       <Icon as={SunIcon}></Icon>
          //     </ScaleFade>
          //   ) : (
          //     <ScaleFade in>
          //       <Icon size={mobile ? 22 : 18}>{MoonIcon}</Icon>
          //     </ScaleFade>
          //   )
          // }
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          onClick={handleClick}
        />
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
