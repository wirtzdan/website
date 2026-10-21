"use client";

import { Button, HStack, Icon, Menu, Portal, Text } from "@chakra-ui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { BoltIcon, BookOpenIcon, BookmarkIcon } from "@heroicons/react/24/solid";
import NextLink from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import {
  initialListsMenuState,
  LISTS_MENU_CLOSE_DELAY_MS,
  reduceListsMenu,
  type ListsMenuEvent,
  type ListsMenuState,
} from "@/lib/lists-menu";
import { useColorModeValue } from "./ui/color-mode";

const ListsMenu = () => {
  const [menu, setMenu] = useState<ListsMenuState>(initialListsMenuState);
  const menuRef = useRef(menu);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const menuButtonHoverBg = useColorModeValue("neutral.200", "neutralD.200");
  const menuBg = useColorModeValue("white", "neutralD.100");
  const menuIconColor = useColorModeValue("blue.500", "blue.200");
  const triggerColor = useColorModeValue("neutral.1100", "neutralD.1100");

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const apply = useCallback(
    (event: ListsMenuEvent) => {
      const effect = reduceListsMenu(menuRef.current, event);
      menuRef.current = effect.state;
      setMenu(effect.state);

      if (effect.clearCloseTimer || effect.scheduleClose) {
        clearCloseTimer();
      }

      if (effect.scheduleClose) {
        closeTimerRef.current = setTimeout(() => {
          closeTimerRef.current = null;
          if (menuRef.current.pinned) {
            return;
          }
          apply({ type: "request-close", now: Date.now() });
        }, LISTS_MENU_CLOSE_DELAY_MS);
      }
    },
    [clearCloseTimer],
  );

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  const onPointerEnter = (event: ReactPointerEvent) => {
    apply({ type: "pointer-enter", pointerType: event.pointerType, now: Date.now() });
  };

  const onPointerLeave = (event: ReactPointerEvent) => {
    apply({ type: "pointer-leave", pointerType: event.pointerType, now: Date.now() });
  };

  return (
    <Menu.Root
      open={menu.open}
      onOpenChange={(details) => {
        apply({
          type: details.open ? "request-open" : "request-close",
          now: Date.now(),
        });
      }}
      positioning={{ placement: "bottom-start" }}
    >
      <Menu.Trigger asChild>
        <Button
          variant="ghost"
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onClick={(event) => {
            // The trigger's own click handler toggles. Owning the click here lets a
            // hover-open menu stay open on the first click, and lets tap open it.
            event.preventDefault();
            apply({ type: "trigger-click", detail: event.detail, now: Date.now() });
          }}
          cursor="default"
          color={triggerColor}
          bg="transparent"
          _hover={{ bg: menuButtonHoverBg }}
          _active={{ bg: menuButtonHoverBg }}
        >
          Lists
          <Icon boxSize={5} asChild>
            <ChevronDownIcon />
          </Icon>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner
          zIndex="popover"
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          css={{
            _before: {
              content: '""',
              position: "absolute",
              insetInline: "0",
              // Invisible bridge across the popper gutter (8px) plus a small overlap
              // so the pointer never falls through the seam under the trigger.
              top: "-12px",
              height: "12px",
            },
          }}
        >
          <Menu.Content>
            <Menu.Item bg={menuBg} _hover={{ bg: menuButtonHoverBg }} value="item-0" asChild>
              <NextLink href="/books">
                <HStack>
                  <Icon boxSize={4.5} color={menuIconColor} asChild>
                    <BookOpenIcon />
                  </Icon>
                  <Text>Books</Text>
                </HStack>
              </NextLink>
            </Menu.Item>
            <Menu.Item bg={menuBg} _hover={{ bg: menuButtonHoverBg }} value="item-1" asChild>
              <NextLink href="/bookmarks">
                <HStack>
                  <Icon boxSize={4.5} color={menuIconColor} asChild>
                    <BookmarkIcon />
                  </Icon>
                  <Text>Bookmarks</Text>
                </HStack>
              </NextLink>
            </Menu.Item>
            <Menu.Item bg={menuBg} _hover={{ bg: menuButtonHoverBg }} value="item-2" asChild>
              <NextLink href="/tools">
                <HStack>
                  <Icon boxSize={4.5} color={menuIconColor} asChild>
                    <BoltIcon />
                  </Icon>
                  <Text>Tools</Text>
                </HStack>
              </NextLink>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default ListsMenu;
