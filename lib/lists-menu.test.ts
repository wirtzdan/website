import { expect, test } from "vite-plus/test";

import {
  initialListsMenuState,
  LISTS_MENU_CLOSE_DELAY_MS,
  LISTS_MENU_TOUCH_CLICK_GUARD_MS,
  reduceListsMenu,
  type ListsMenuState,
} from "./lists-menu";

const closed = initialListsMenuState;

function enterMouse(state: ListsMenuState, now = 1_000) {
  return reduceListsMenu(state, { type: "pointer-enter", pointerType: "mouse", now });
}

test("keeps the hover menu open long enough to cross into the panel", () => {
  expect(LISTS_MENU_CLOSE_DELAY_MS).toBeGreaterThanOrEqual(300);
});

test("mouse enter opens the menu without pinning it", () => {
  const effect = enterMouse(closed);

  expect(effect.state).toEqual({ open: true, pinned: false, ignoreCloseUntil: 0 });
  expect(effect.clearCloseTimer).toBe(true);
  expect(effect.scheduleClose).toBe(false);
});

test("mouse leave schedules a close only while the menu is hovering open", () => {
  const open = enterMouse(closed).state;
  const leaving = reduceListsMenu(open, {
    type: "pointer-leave",
    pointerType: "mouse",
    now: 1_100,
  });

  expect(leaving.scheduleClose).toBe(true);
  expect(leaving.state).toEqual(open);

  const backInside = enterMouse(leaving.state, 1_200);
  expect(backInside.clearCloseTimer).toBe(true);
  expect(backInside.scheduleClose).toBe(false);
  expect(backInside.state.open).toBe(true);
});

test("mouse leave does nothing when the menu is closed or pinned", () => {
  const leaveClosed = reduceListsMenu(closed, {
    type: "pointer-leave",
    pointerType: "mouse",
    now: 1_000,
  });
  expect(leaveClosed).toMatchObject({ scheduleClose: false, state: closed });

  const pinned = reduceListsMenu(closed, { type: "trigger-click", detail: 1, now: 1_000 }).state;
  const leavePinned = reduceListsMenu(pinned, {
    type: "pointer-leave",
    pointerType: "mouse",
    now: 1_200,
  });
  expect(leavePinned.scheduleClose).toBe(false);
  expect(leavePinned.state).toEqual(pinned);
});

test("click opens a closed menu and a second click closes it", () => {
  const opened = reduceListsMenu(closed, { type: "trigger-click", detail: 1, now: 1_000 });
  expect(opened.state).toEqual({ open: true, pinned: true, ignoreCloseUntil: 0 });

  const closedAgain = reduceListsMenu(opened.state, {
    type: "trigger-click",
    detail: 1,
    now: 2_000,
  });
  expect(closedAgain.state).toEqual(closed);
  expect(closedAgain.clearCloseTimer).toBe(true);
});

test("click while hover-open pins the menu instead of closing it", () => {
  const hovering = enterMouse(closed).state;
  const pinned = reduceListsMenu(hovering, { type: "trigger-click", detail: 1, now: 1_500 });

  expect(pinned.state).toEqual({ open: true, pinned: true, ignoreCloseUntil: 0 });
  expect(pinned.clearCloseTimer).toBe(true);
});

test("touch pointerenter opens and ignores the click from the same tap", () => {
  const now = 5_000;
  const tapped = reduceListsMenu(closed, { type: "pointer-enter", pointerType: "touch", now });

  expect(tapped.state.open).toBe(true);
  expect(tapped.state.pinned).toBe(true);
  expect(tapped.state.ignoreCloseUntil).toBe(now + LISTS_MENU_TOUCH_CLICK_GUARD_MS);

  const sameTap = reduceListsMenu(tapped.state, {
    type: "trigger-click",
    detail: 1,
    now: now + 30,
  });
  expect(sameTap.state).toEqual(tapped.state);
  expect(sameTap.scheduleClose).toBe(false);

  const laterTap = reduceListsMenu(tapped.state, {
    type: "trigger-click",
    detail: 1,
    now: now + LISTS_MENU_TOUCH_CLICK_GUARD_MS + 1,
  });
  expect(laterTap.state).toEqual(closed);
});

test("pen input follows the touch path", () => {
  const effect = reduceListsMenu(closed, { type: "pointer-enter", pointerType: "pen", now: 10 });
  expect(effect.state.pinned).toBe(true);
  expect(effect.state.open).toBe(true);
});

test("touch pointerleave does not schedule a close", () => {
  const open = reduceListsMenu(closed, {
    type: "pointer-enter",
    pointerType: "touch",
    now: 10,
  }).state;
  const leave = reduceListsMenu(open, { type: "pointer-leave", pointerType: "touch", now: 40 });
  expect(leave.scheduleClose).toBe(false);
  expect(leave.state.open).toBe(true);
});

test("keyboard open pins the menu and dismiss closes it", () => {
  const opened = reduceListsMenu(closed, { type: "request-open", now: 1 });
  expect(opened.state).toEqual({ open: true, pinned: true, ignoreCloseUntil: 0 });

  const keyboardClick = reduceListsMenu(opened.state, { type: "trigger-click", detail: 0, now: 2 });
  expect(keyboardClick.state).toEqual(opened.state);

  const dismissed = reduceListsMenu(opened.state, { type: "request-close", now: 3 });
  expect(dismissed.state).toEqual(closed);
  expect(dismissed.clearCloseTimer).toBe(true);
});
