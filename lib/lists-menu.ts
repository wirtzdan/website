/**
 * Open/close policy for the desktop "Lists" menu.
 *
 * Hover opens the menu and leaves it unpinned, so the pointer can travel into
 * the panel before a delayed close. Click, tap, and keyboard open pin it so
 * it stays up without hover (touch has none). A second click closes a pinned
 * menu. Touch taps often emit pointerenter and then click; the short guard
 * keeps that second event from closing the menu it just opened.
 */

export const LISTS_MENU_CLOSE_DELAY_MS = 400;

/** Ignore the click that iOS/touch fires immediately after pointerenter. */
export const LISTS_MENU_TOUCH_CLICK_GUARD_MS = 700;

export type ListsMenuState = {
  open: boolean;
  /** Click, keyboard, or touch opened the menu. Pointer leave must not close it. */
  pinned: boolean;
  /** Epoch ms. Trigger clicks before this time do not close a pinned menu. */
  ignoreCloseUntil: number;
};

export const initialListsMenuState: ListsMenuState = {
  open: false,
  pinned: false,
  ignoreCloseUntil: 0,
};

export type ListsMenuEvent =
  | { type: "pointer-enter"; pointerType: string; now: number }
  | { type: "pointer-leave"; pointerType: string; now: number }
  | { type: "trigger-click"; detail: number; now: number }
  | { type: "request-open"; now: number }
  | { type: "request-close"; now: number };

export type ListsMenuEffect = {
  state: ListsMenuState;
  /** Arm the close timer. Pointer enter cancels it before it fires. */
  scheduleClose: boolean;
  clearCloseTimer: boolean;
};

const unchanged = (state: ListsMenuState): ListsMenuEffect => ({
  state,
  scheduleClose: false,
  clearCloseTimer: false,
});

function pinOpen(ignoreCloseUntil = 0): ListsMenuEffect {
  return {
    state: { open: true, pinned: true, ignoreCloseUntil },
    scheduleClose: false,
    clearCloseTimer: true,
  };
}

export function reduceListsMenu(state: ListsMenuState, event: ListsMenuEvent): ListsMenuEffect {
  switch (event.type) {
    case "pointer-enter": {
      if (event.pointerType === "mouse") {
        return {
          state: { ...state, open: true },
          scheduleClose: false,
          clearCloseTimer: true,
        };
      }

      if (event.pointerType === "touch" || event.pointerType === "pen") {
        return pinOpen(event.now + LISTS_MENU_TOUCH_CLICK_GUARD_MS);
      }

      return unchanged(state);
    }
    case "pointer-leave": {
      if (event.pointerType !== "mouse" || state.pinned || !state.open) {
        return unchanged(state);
      }

      return {
        state,
        scheduleClose: true,
        clearCloseTimer: false,
      };
    }
    case "trigger-click": {
      // Keyboard activation is handled by request-open (ArrowDown / Enter / Space).
      if (event.detail === 0) {
        return unchanged(state);
      }

      if (state.open && state.pinned) {
        if (event.now < state.ignoreCloseUntil) {
          return {
            state,
            scheduleClose: false,
            clearCloseTimer: true,
          };
        }

        return {
          state: initialListsMenuState,
          scheduleClose: false,
          clearCloseTimer: true,
        };
      }

      return pinOpen();
    }
    case "request-open":
      return pinOpen();
    case "request-close":
      return {
        state: initialListsMenuState,
        scheduleClose: false,
        clearCloseTimer: true,
      };
    default: {
      const exhaustive: never = event;
      return exhaustive;
    }
  }
}
