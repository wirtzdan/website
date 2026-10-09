import { expect, test } from "vite-plus/test";

import {
  examplePanel,
  deviceCodes,
  isPanel,
  numberLabelWidth,
  MODULES_PER_ROW,
  placePanel,
  rcdColorMap,
  rowModules,
} from "./fuse-box";

test("example panel fills every row exactly", () => {
  examplePanel.rows.forEach((row) => expect(rowModules(row)).toBe(MODULES_PER_ROW));
});

test("places devices at panel positions across rows", () => {
  const placed = placePanel(examplePanel);
  const stove = placed.find(({ device }) => device.id === "g10");
  const oven = placed.find(({ device }) => device.id === "g24");
  expect([stove?.start, stove?.end]).toEqual([10, 11]);
  expect([oven?.start, oven?.end]).toEqual([24, 24]);
});

test("numbers devices per IEC 81346 letter code in panel order", () => {
  const codes = deviceCodes(examplePanel);
  expect(codes.get("rcd1")).toBe("Q1");
  expect(codes.get("g3")).toBe("F1");
  expect(codes.get("g10")).toBe("F6");
  expect(codes.get("main")).toBe("S1");
  expect(codes.get("rcd2")).toBe("Q3");
  expect(codes.get("g24")).toBe("F11");
  expect(codes.has("e7")).toBe(false);
});

test("gives each RCD its own colour", () => {
  const colors = rcdColorMap(examplePanel);
  expect(new Set(colors.values()).size).toBe(3);
});

test("validates stored panels", () => {
  expect(isPanel(examplePanel)).toBe(true);
  expect(isPanel({ rows: [[{ id: "x", span: 1, kind: "toaster" }]] })).toBe(false);
  expect(isPanel(null)).toBe(false);
});

test("widens number labels by one module pitch per extra module", () => {
  expect(numberLabelWidth(1)).toBe(18);
  expect(numberLabelWidth(2)).toBe(35.5);
});

test("uses a chosen RCD colour over the default", () => {
  const panel = {
    rows: [[{ id: "q", kind: "rcd" as const, span: 2, title: "", detail: "", color: "#dc2626" }]],
  };
  expect(rcdColorMap(panel).get("q")).toBe("#dc2626");
});
