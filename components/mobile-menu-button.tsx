"use client";
import { Box, Text, VStack, type StackProps } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";
import { cloneElement, isValidElement, type ReactElement } from "react";

const ICON_SIZE_PX = 20;

interface MobileMenuButtonProps extends StackProps {
  label: string;
  icon: ReactElement;
}

const MobileMenuButton = ({ label, icon, as = "button", ...rest }: MobileMenuButtonProps) => {
  // Force explicit SVG dimensions. Chakra Icon asChild + Heroicons was leaving the
  // theme moon/sun at ~2× the Blog/Menu icons and overflowing the mobile nav bar.
  const sizedIcon = isValidElement(icon)
    ? cloneElement(icon as ReactElement<Record<string, unknown>>, {
        width: ICON_SIZE_PX,
        height: ICON_SIZE_PX,
        style: {
          width: ICON_SIZE_PX,
          height: ICON_SIZE_PX,
          display: "block",
          flexShrink: 0,
        },
      })
    : icon;

  return (
    <VStack
      gap={0}
      rounded="md"
      px={6}
      w="100%"
      {...rest}
      as={as}
      minH="11"
      justify="center"
      type={as === "button" ? "button" : undefined}
      userSelect="none"
      style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none" }}
      _active={{ bg: { _light: "neutral.200", _dark: "neutralD.300" } }}
      color={useColorModeValue("neutral.1100", "neutralD.1100")}
    >
      <Box
        boxSize={`${ICON_SIZE_PX}px`}
        flexShrink={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        lineHeight={0}
      >
        {sizedIcon}
      </Box>

      <Text
        fontSize="xs"
        fontWeight="500"
        color={useColorModeValue("neutral.1000", "neutralD.1000")}
      >
        {label}
      </Text>
    </VStack>
  );
};

export default MobileMenuButton;
