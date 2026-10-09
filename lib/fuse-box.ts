export const MODULES_PER_ROW = 12;
export const MODULE_WIDTH_MM = 17.5;
export const STRIP_WIDTH_MM = 214;
export const STRIP_HEIGHT_MM = 36;
export const NUMBER_LABEL_WIDTH_MM = 18;
export const NUMBER_LABEL_HEIGHT_MM = 13;
export const MAX_ROWS = 4;

export type DeviceKind = "group" | "rcd" | "main" | "empty";

export interface Device {
  id: string;
  kind: DeviceKind;
  span: number;
  title: string;
  detail: string;
  rcdId?: string;
  /** Colour for an RCD and the groups behind it; defaults by RCD order. */
  color?: string;
}

export interface Panel {
  rows: Device[][];
}

export interface PlacedDevice {
  device: Device;
  row: number;
  /** Zero-based module offset within the row. */
  offset: number;
  /** One-based panel position of the first module. */
  start: number;
  /** One-based panel position of the last module. */
  end: number;
}

/** IEC 81346 letter codes: S manual switch, Q switching power, F protection. */
export const deviceKindPrefixes: Record<DeviceKind, string | undefined> = {
  group: "F",
  rcd: "Q",
  main: "S",
  empty: undefined,
};

export const deviceKindLabels: Record<DeviceKind, string> = {
  group: "Group",
  rcd: "RCD",
  main: "Main switch",
  empty: "Empty",
};

// Chakra UI's 600 shades: saturated enough to read as a thin band and to carry white text.
export const colorSwatches = [
  { name: "Blue", value: "#2563eb" },
  { name: "Orange", value: "#ea580c" },
  { name: "Green", value: "#16a34a" },
  { name: "Purple", value: "#9333ea" },
  { name: "Pink", value: "#db2777" },
  { name: "Cyan", value: "#0891b2" },
  { name: "Red", value: "#dc2626" },
  { name: "Yellow", value: "#ca8a04" },
  { name: "Teal", value: "#0d9488" },
  { name: "Gray", value: "#52525b" },
];
export const rcdColors = colorSwatches.slice(0, 6).map((swatch) => swatch.value);
export const DEFAULT_RCD_TITLE = "Earth-leakage switch";
export const NO_RCD_COLOR = "#94A3B8";
export const MAIN_SWITCH_COLOR = "#334155";

let idCounter = 0;
export function createId(): string {
  idCounter += 1;
  return `d${Date.now().toString(36)}${idCounter.toString(36)}`;
}

export function createDevice(partial: Partial<Device> = {}): Device {
  return { id: createId(), kind: "group", span: 1, title: "", detail: "", ...partial };
}

export function createEmptyRow(): Device[] {
  return [createDevice({ kind: "empty", span: MODULES_PER_ROW })];
}

export const examplePanel: Panel = {
  rows: [
    [
      { id: "rcd1", kind: "rcd", span: 2, title: "Earth-leakage switch", detail: "" },
      { id: "g3", kind: "group", span: 1, title: "Utility room", detail: "Garden", rcdId: "rcd1" },
      { id: "g4", kind: "group", span: 1, title: "Unknown", detail: "", rcdId: "rcd1" },
      {
        id: "g5",
        kind: "group",
        span: 1,
        title: "First floor",
        detail: "Bedroom · Stairs",
        rcdId: "rcd1",
      },
      {
        id: "g6",
        kind: "group",
        span: 1,
        title: "Top floor",
        detail: "Guest room · Office · Ventilation · Boiler",
        rcdId: "rcd1",
      },
      { id: "e7", kind: "empty", span: 2, title: "", detail: "" },
      { id: "g9", kind: "group", span: 1, title: "Unknown", detail: "", rcdId: "rcd3" },
      { id: "g10", kind: "group", span: 2, title: "Stove", detail: "", rcdId: "rcd3" },
      {
        id: "g12",
        kind: "group",
        span: 1,
        title: "Laundry",
        detail: "Office",
        rcdId: "rcd3",
      },
    ],
    [
      { id: "main", kind: "main", span: 4, title: "Main switch", detail: "" },
      { id: "rcd3", kind: "rcd", span: 2, title: "Earth-leakage switch", detail: "" },
      { id: "rcd2", kind: "rcd", span: 2, title: "Earth-leakage switch", detail: "" },
      { id: "g21", kind: "group", span: 1, title: "Dishwasher", detail: "", rcdId: "rcd2" },
      {
        id: "g22",
        kind: "group",
        span: 1,
        title: "Living room",
        detail: "Bathroom · Toilets",
        rcdId: "rcd2",
      },
      {
        id: "g23",
        kind: "group",
        span: 1,
        title: "Kitchen",
        detail: "Fridge · Extractor fan",
        rcdId: "rcd2",
      },
      { id: "g24", kind: "group", span: 1, title: "Oven", detail: "", rcdId: "rcd2" },
    ],
  ],
};

export function rowModules(row: Device[]): number {
  return row.reduce((sum, device) => sum + device.span, 0);
}

export function placeRow(row: Device[], rowIndex: number): PlacedDevice[] {
  let offset = 0;
  return row.map((device) => {
    const start = rowIndex * MODULES_PER_ROW + offset + 1;
    const placed = { device, row: rowIndex, offset, start, end: start + device.span - 1 };
    offset += device.span;
    return placed;
  });
}

export function placePanel(panel: Panel): PlacedDevice[] {
  return panel.rows.flatMap((row, rowIndex) => placeRow(row, rowIndex));
}

/** One module is 18 mm; every extra module adds one 17.5 mm module pitch. */
export function numberLabelWidth(span: number): number {
  return NUMBER_LABEL_WIDTH_MM + (span - 1) * MODULE_WIDTH_MM;
}

export function formatPosition(start: number, end: number): string {
  return start === end ? String(start) : `${start}–${end}`;
}

/** Numbers each device per IEC 81346 letter code, in panel order (S1, Q1–Q3, F1–F12…). */
export function deviceCodes(panel: Panel): Map<string, string> {
  const counts = new Map<string, number>();
  const codes = new Map<string, string>();
  panel.rows.flat().forEach((device) => {
    const prefix = deviceKindPrefixes[device.kind];
    if (prefix) {
      const count = (counts.get(prefix) ?? 0) + 1;
      counts.set(prefix, count);
      codes.set(device.id, `${prefix}${count}`);
    }
  });
  return codes;
}

export function rcdColorMap(panel: Panel): Map<string, string> {
  const map = new Map<string, string>();
  panel.rows.flat().forEach((device) => {
    if (device.kind === "rcd") {
      map.set(device.id, device.color ?? rcdColors[map.size % rcdColors.length]!);
    }
  });
  return map;
}

export function deviceColor(device: Device, colors: Map<string, string>): string | undefined {
  switch (device.kind) {
    case "rcd":
      return colors.get(device.id);
    case "group":
      return (device.rcdId && colors.get(device.rcdId)) || NO_RCD_COLOR;
    case "main":
      return MAIN_SWITCH_COLOR;
    default:
      return undefined;
  }
}

export function isPanel(value: unknown): value is Panel {
  if (!value || typeof value !== "object" || !Array.isArray((value as Panel).rows)) {
    return false;
  }
  return (value as Panel).rows.every(
    (row) =>
      Array.isArray(row) &&
      row.every(
        (device) =>
          typeof device?.id === "string" &&
          typeof device.span === "number" &&
          device.kind in deviceKindLabels,
      ),
  );
}
