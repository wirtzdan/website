"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { IBM_Plex_Sans_Condensed } from "next/font/google";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  List,
  NativeSelect,
  Splitter,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import {
  ArrowCounterClockwise,
  CaretDown,
  CaretUp,
  CornersOut,
  Eye,
  FilePlus,
  PencilSimple,
  Plus,
  Printer,
  Trash,
  X,
} from "phosphor-react";

import AvatarNavigation from "@/components/avatar-navigation";
import { useColorModeValue } from "@/components/ui/color-mode";
import {
  createDevice,
  createEmptyRow,
  deviceCodes,
  deviceColor,
  DEFAULT_RCD_TITLE,
  deviceKindLabels,
  examplePanel,
  formatPosition,
  isPanel,
  MAX_ROWS,
  MODULE_WIDTH_MM,
  MODULES_PER_ROW,
  NUMBER_LABEL_HEIGHT_MM,
  NUMBER_LABEL_WIDTH_MM,
  numberLabelWidth,
  placeRow,
  rcdColorMap,
  rowModules,
  STRIP_HEIGHT_MM,
  STRIP_WIDTH_MM,
  type Device,
  type DeviceKind,
  type Panel,
  type PlacedDevice,
} from "@/lib/fuse-box";

const condensed = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-condensed",
  weight: ["500", "700"],
});

const STORAGE_KEY = "fuse-box-labeler:v1";
const STORAGE_VERSION = 2;
const STRIP_CODES_KEY = "fuse-box-labeler:strip-codes";
const SPLIT_SIZES_KEY = "fuse-box-labeler:split";
const SHEET_WIDTH_MM = 297;
const SHEET_HEIGHT_MM = 210;
const SHEET_WIDTH_PX = (SHEET_WIDTH_MM * 96) / 25.4;
const STRIP_SIDE_MARGIN_MM = (STRIP_WIDTH_MM - MODULES_PER_ROW * MODULE_WIDTH_MM) / 2;
const DIVIDER_MM = 0.5;
const INK = "#0F172A";
const CUT_LINE = "#94A3B8";

const printStyles = `
.fbl-print-root { position: absolute; left: -10000px; top: 0; }
@media screen {
  .fbl-preview [data-overflow="true"] { box-shadow: inset 0 0 0 0.4mm #DC2626; }
}
@media print {
  @page { size: A4 landscape; margin: 0; }
  html, body { background: #fff !important; margin: 0 !important; padding: 0 !important; }
  body > *:not(.fbl-print-root) { display: none !important; }
  .fbl-print-root { position: static; }
  .fbl-print-root .fbl-sheet { height: auto !important; }
}
.fbl-sheet { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
`;

const mm = (value: number) => `${value}mm`;

function loadPanel(): Panel | undefined {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : undefined;
    if (!isPanel(parsed)) {
      return undefined;
    }
    if ((parsed as { version?: number }).version === STORAGE_VERSION) {
      return { rows: parsed.rows };
    }
    // Earlier versions named RCDs "F1" (clashing with IEC 81346 group codes) or "RCD".
    return {
      rows: parsed.rows.map((row) =>
        row.map((device) =>
          device.kind === "rcd" && /^(F\d+|RCD)$/.test(device.title)
            ? { ...device, title: DEFAULT_RCD_TITLE }
            : device,
        ),
      ),
    };
  } catch {
    return undefined;
  }
}

const DEFAULT_SPLIT_SIZES = [32, 68];

function loadSplitSizes(): number[] {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(SPLIT_SIZES_KEY) ?? "null");
    if (Array.isArray(stored) && stored.length === 2 && stored.every(Number.isFinite)) {
      return stored as number[];
    }
  } catch {
    // Fall back to the default split.
  }
  return DEFAULT_SPLIT_SIZES;
}

function saveSplitSizes(sizes: number[]) {
  try {
    window.localStorage.setItem(SPLIT_SIZES_KEY, JSON.stringify(sizes));
  } catch {
    // Storage can be unavailable (private mode).
  }
}

function savePanel(panel: Panel) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: STORAGE_VERSION, rows: panel.rows }),
    );
  } catch {
    // Storage can be unavailable (private mode); editing still works for this visit.
  }
}

function useFontsReady(): number {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    void document.fonts?.ready.then(() => active && setVersion((v) => v + 1));
    return () => {
      active = false;
    };
  }, []);
  return version;
}

// Words never break mid-word; a word that doesn't fit shrinks the text instead.
const noWordBreaks = { overflowWrap: "normal", wordBreak: "normal" } as const;

/** Shrinks the text until it fits the cell, and flags cells that still overflow. */
function FitText({ title, detail, width }: { title: string; detail: string; width: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const fontsReady = useFontsReady();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const overflows = () =>
      el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
    let scale = 1;
    el.style.setProperty("--fit", "1");
    while (overflows() && scale > 0.6) {
      scale = Math.round((scale - 0.05) * 100) / 100;
      el.style.setProperty("--fit", String(scale));
    }
    el.dataset.overflow = String(overflows());
  }, [title, detail, width, fontsReady]);

  return (
    <div
      ref={ref}
      style={{
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        padding: "1.2mm 1mm",
        lineHeight: 1.12,
      }}
    >
      {title ? (
        <div style={{ ...noWordBreaks, fontSize: "calc(8.5pt * var(--fit, 1))", fontWeight: 700 }}>
          {title}
        </div>
      ) : null}
      {detail ? (
        <div
          style={{
            ...noWordBreaks,
            fontSize: "calc(6.5pt * var(--fit, 1))",
            fontWeight: 500,
            color: "#334155",
            marginTop: "0.8mm",
          }}
        >
          {detail}
        </div>
      ) : null}
    </div>
  );
}

function DescriptionStrip({
  placedRow,
  colors,
  codes,
  showCodes,
}: {
  placedRow: PlacedDevice[];
  colors: Map<string, string>;
  codes: Map<string, string>;
  showCodes: boolean;
}) {
  const boundaries = [...placedRow.map((p) => p.offset), MODULES_PER_ROW];

  return (
    <div style={{ position: "relative", width: mm(STRIP_WIDTH_MM), height: mm(STRIP_HEIGHT_MM) }}>
      <div
        aria-hidden
        style={{ position: "absolute", inset: 0, border: `0.2mm dashed ${CUT_LINE}` }}
      />
      {placedRow.map((placed) => {
        const { device, offset } = placed;
        if (device.kind === "empty") {
          return null;
        }
        const color = deviceColor(device, colors);
        const widthMm = device.span * MODULE_WIDTH_MM - DIVIDER_MM;
        const title = device.kind === "rcd" ? device.title || DEFAULT_RCD_TITLE : device.title;
        return (
          <div
            key={device.id}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: mm(STRIP_SIDE_MARGIN_MM + offset * MODULE_WIDTH_MM + DIVIDER_MM / 2),
              width: mm(widthMm),
              display: "flex",
              flexDirection: "column",
              background: device.kind === "rcd" && color ? `${color}1F` : undefined,
            }}
          >
            <FitText title={title} detail={device.detail} width={widthMm} />
            <div
              style={{
                height: showCodes ? "4.6mm" : "3mm",
                flex: "none",
                background: color,
                color: "#fff",
                fontSize: "8.5pt",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                paddingLeft: "1.2mm",
              }}
            >
              {showCodes ? codes.get(device.id) : null}
            </div>
          </div>
        );
      })}
      {[...new Set(boundaries)].map((offset) => (
        <div
          key={offset}
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: mm(STRIP_SIDE_MARGIN_MM + offset * MODULE_WIDTH_MM - DIVIDER_MM / 2),
            width: mm(DIVIDER_MM),
            background: INK,
          }}
        />
      ))}
    </div>
  );
}

function NumberLabel({ device, code, color }: { device: Device; code: string; color?: string }) {
  const isRcd = device.kind === "rcd";

  return (
    <div
      style={{
        width: mm(numberLabelWidth(device.span)),
        height: mm(NUMBER_LABEL_HEIGHT_MM),
        boxSizing: "border-box",
        outline: `0.15mm dashed ${CUT_LINE}`,
        outlineOffset: "-0.075mm",
        display: "flex",
        flexDirection: "column",
        background: isRcd ? color : "#fff",
        color: isRcd ? "#fff" : INK,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: code.length <= 2 || device.span > 1 ? "22pt" : "19pt",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {code}
      </div>
      {!isRcd ? <div style={{ height: "2.4mm", background: color }} /> : null}
    </div>
  );
}

function Ruler() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "3mm" }}>
      <div
        style={{
          position: "relative",
          width: "100mm",
          height: "2.5mm",
          borderBottom: `0.25mm solid ${INK}`,
        }}
      >
        {Array.from({ length: 11 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: 0,
              left: `calc(${i * 10}mm - 0.125mm)`,
              width: "0.25mm",
              height: i % 5 === 0 ? "2.5mm" : "1.4mm",
              background: INK,
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: "7pt", color: "#475569" }}>
        This line should measure exactly 100 mm
      </div>
    </div>
  );
}

function SheetHeading({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: "7pt",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "#475569",
        margin: "0 0 1.5mm",
      }}
    >
      {children}
    </div>
  );
}

function Sheet({ panel, showStripCodes }: { panel: Panel; showStripCodes: boolean }) {
  const colors = useMemo(() => rcdColorMap(panel), [panel]);
  const codes = useMemo(() => deviceCodes(panel), [panel]);
  const labels = panel.rows.flat().filter((device) => codes.has(device.id));

  return (
    <div
      className={`fbl-sheet ${condensed.variable}`}
      style={{
        width: mm(SHEET_WIDTH_MM),
        height: mm(SHEET_HEIGHT_MM),
        padding: "10mm",
        boxSizing: "border-box",
        background: "#fff",
        color: INK,
        fontFamily: "var(--font-plex-condensed), 'Arial Narrow', sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "6mm",
      }}
    >
      <Ruler />
      <div style={{ display: "flex", flexDirection: "column", gap: "5mm" }}>
        {panel.rows.map((row, rowIndex) => (
          <div key={rowIndex}>
            <SheetHeading>
              Row {rowIndex + 1} · {rowIndex * MODULES_PER_ROW + 1}–
              {(rowIndex + 1) * MODULES_PER_ROW}
            </SheetHeading>
            <DescriptionStrip
              placedRow={placeRow(row, rowIndex)}
              colors={colors}
              codes={codes}
              showCodes={showStripCodes}
            />
          </div>
        ))}
      </div>
      {labels.length > 0 ? (
        <div>
          <SheetHeading>Number labels</SheetHeading>
          <div style={{ display: "flex", flexWrap: "wrap", maxWidth: "277mm" }}>
            {labels.map((device) => (
              <NumberLabel
                key={device.id}
                device={device}
                code={codes.get(device.id)!}
                color={deviceColor(device, colors)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const PREVIEW_PADDING_PX = 24;
const SHEET_HEIGHT_PX = (SHEET_HEIGHT_MM * 96) / 25.4;

/** Scales the A4 sheet to fit its container in both directions. */
function ScaledPreview({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const update = () => {
      const width = el.clientWidth - PREVIEW_PADDING_PX * 2;
      const height = el.clientHeight - PREVIEW_PADDING_PX * 2;
      setScale(Math.max(0, Math.min(width / SHEET_WIDTH_PX, height / SHEET_HEIGHT_PX)));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Flex
      ref={ref}
      className="fbl-preview"
      flex={1}
      minH={0}
      align="center"
      justify="center"
      overflow="hidden"
    >
      <Box
        flex="none"
        shadow="lg"
        rounded="sm"
        overflow="hidden"
        style={{ width: SHEET_WIDTH_PX * scale, height: SHEET_HEIGHT_PX * scale }}
      >
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>{children}</div>
      </Box>
    </Flex>
  );
}

function FullscreenPreview({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [actualSize, setActualSize] = useState(false);

  useEffect(() => {
    const el = ref.current;
    // Use real fullscreen where the browser allows it; the overlay covers the window otherwise.
    void el?.requestFullscreen?.().catch(() => undefined);
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    const onFullscreenChange = () => !document.fullscreenElement && onClose();
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      if (document.fullscreenElement) {
        void document.exitFullscreen().catch(() => undefined);
      }
    };
  }, [onClose]);

  return (
    <Flex
      ref={ref}
      position="fixed"
      inset={0}
      zIndex="modal"
      direction="column"
      bg="#1E293B"
      color="white"
    >
      <Flex flex="none" align="center" gap={2} px={4} py={3}>
        <Text fontWeight="600" fontSize="md">
          Preview
        </Text>
        <Button
          size="xs"
          variant="subtle"
          colorPalette="gray"
          ml="auto"
          onClick={() => setActualSize((value) => !value)}
        >
          {actualSize ? "Fit to screen" : "Actual size"}
        </Button>
        <IconButton
          aria-label="Close preview"
          size="sm"
          variant="subtle"
          colorPalette="gray"
          onClick={onClose}
        >
          <X />
        </IconButton>
      </Flex>
      {actualSize ? (
        <Box flex={1} minH={0} overflow="auto" className="fbl-preview" p={6}>
          <Box w="max-content" mx="auto" shadow="lg">
            {children}
          </Box>
        </Box>
      ) : (
        <ScaledPreview>{children}</ScaledPreview>
      )}
    </Flex>
  );
}

function SmallSelect({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <NativeSelect.Root size="sm" minW={0}>
      <NativeSelect.Field
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        {children}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}

const titlePlaceholders: Record<DeviceKind, string> = {
  group: "Name, e.g. Kitchen",
  rcd: DEFAULT_RCD_TITLE,
  main: "Main switch",
  empty: "",
};

function DeviceEditor({
  placed,
  rcds,
  colors,
  codes,
  isFirst,
  isLast,
  onChange,
  onMove,
  onRemove,
}: {
  placed: PlacedDevice;
  rcds: Device[];
  colors: Map<string, string>;
  codes: Map<string, string>;
  isFirst: boolean;
  isLast: boolean;
  onChange: (patch: Partial<Device>) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  const { device, start, end } = placed;
  const color = deviceColor(device, colors);
  const border = useColorModeValue("neutral.400", "neutralD.400");
  const cardBg = useColorModeValue("white", "neutralD.100");
  const rcdId = device.rcdId && colors.has(device.rcdId) ? device.rcdId : "";

  const changeKind = (kind: DeviceKind) => {
    if (kind === "rcd" && !device.title) {
      onChange({ kind, title: DEFAULT_RCD_TITLE });
    } else if (kind === "main" && !device.title) {
      onChange({ kind, title: "Main switch" });
    } else {
      onChange({ kind });
    }
  };

  return (
    <VStack
      align="stretch"
      gap={2}
      borderWidth="1px"
      borderColor={border}
      bg={cardBg}
      rounded="lg"
      p={3}
    >
      <Flex gap={2} align="center">
        <Badge
          minW="2.75rem"
          justifyContent="center"
          size="lg"
          variant="solid"
          style={{ background: color ?? "transparent", color: color ? "#fff" : undefined }}
          borderWidth={color ? 0 : "1px"}
        >
          {codes.get(device.id) ?? "–"}
        </Badge>
        <Text fontSize="xs" color="fg.muted" whiteSpace="nowrap">
          Pos. {formatPosition(start, end)}
        </Text>
        <HStack gap={0} ml="auto">
          <IconButton
            aria-label="Move up"
            size="xs"
            variant="ghost"
            disabled={isFirst}
            onClick={() => onMove(-1)}
          >
            <CaretUp />
          </IconButton>
          <IconButton
            aria-label="Move down"
            size="xs"
            variant="ghost"
            disabled={isLast}
            onClick={() => onMove(1)}
          >
            <CaretDown />
          </IconButton>
          <IconButton aria-label="Remove" size="xs" variant="ghost" onClick={onRemove}>
            <Trash />
          </IconButton>
        </HStack>
      </Flex>
      {device.kind !== "empty" ? (
        <>
          <Input
            size="sm"
            aria-label="Name"
            placeholder={titlePlaceholders[device.kind]}
            value={device.title}
            onChange={(event) => onChange({ title: event.currentTarget.value })}
          />
          <Input
            size="sm"
            aria-label="Details"
            placeholder={
              device.kind === "group"
                ? "Details, e.g. Fridge · Extractor fan"
                : "Details (optional)"
            }
            value={device.detail}
            onChange={(event) => onChange({ detail: event.currentTarget.value })}
          />
        </>
      ) : null}
      <Grid templateColumns={device.kind === "group" ? "1fr 1fr 1fr" : "1fr 1fr"} gap={2}>
        <SmallSelect
          label="Type"
          value={device.kind}
          onChange={(value) => changeKind(value as DeviceKind)}
        >
          {Object.entries(deviceKindLabels).map(([kind, label]) => (
            <option key={kind} value={kind}>
              {label}
            </option>
          ))}
        </SmallSelect>
        <SmallSelect
          label="Width in modules"
          value={String(device.span)}
          onChange={(value) => onChange({ span: Number(value) })}
        >
          {Array.from({ length: MODULES_PER_ROW }, (_, i) => i + 1).map((span) => (
            <option key={span} value={span}>
              {span} {span === 1 ? "module" : "modules"}
            </option>
          ))}
        </SmallSelect>
        {device.kind === "group" ? (
          <SmallSelect
            label="RCD"
            value={rcdId}
            onChange={(value) => onChange({ rcdId: value || undefined })}
          >
            <option value="">No RCD</option>
            {rcds.map((rcd) => (
              <option key={rcd.id} value={rcd.id}>
                {codes.get(rcd.id)} · {rcd.title || DEFAULT_RCD_TITLE}
              </option>
            ))}
          </SmallSelect>
        ) : null}
      </Grid>
    </VStack>
  );
}

export default function FuseBoxPage() {
  const [panel, setPanel] = useState<Panel>(examplePanel);
  const [hydrated, setHydrated] = useState(false);
  const [printRoot, setPrintRoot] = useState<HTMLElement | null>(null);
  const [showStripCodes, setShowStripCodes] = useState(true);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [fullscreen, setFullscreen] = useState(false);
  const isDesktop = useBreakpointValue({ base: false, lg: true }, { ssr: false }) ?? false;
  const closeFullscreen = useCallback(() => setFullscreen(false), []);
  const mutedText = useColorModeValue("neutral.1000", "neutralD.1000");
  const panelBg = useColorModeValue("white", "neutralD.100");
  const canvasBg = useColorModeValue("neutral.200", "neutralD.50");
  const border = useColorModeValue("neutral.400", "neutralD.400");

  useEffect(() => {
    const stored = loadPanel();
    if (stored) {
      setPanel(stored);
    }
    try {
      setShowStripCodes(window.localStorage.getItem(STRIP_CODES_KEY) !== "false");
    } catch {
      // Keep the default when storage is unavailable.
    }
    setHydrated(true);

    const root = document.createElement("div");
    root.className = "fbl-print-root";
    document.body.appendChild(root);
    setPrintRoot(root);
    return () => root.remove();
  }, []);

  useEffect(() => {
    if (hydrated) {
      savePanel(panel);
    }
  }, [panel, hydrated]);

  useEffect(() => {
    if (hydrated) {
      try {
        window.localStorage.setItem(STRIP_CODES_KEY, String(showStripCodes));
      } catch {
        // Storage can be unavailable (private mode).
      }
    }
  }, [showStripCodes, hydrated]);

  const colors = useMemo(() => rcdColorMap(panel), [panel]);
  const codes = useMemo(() => deviceCodes(panel), [panel]);
  const rcds = panel.rows.flat().filter((device) => device.kind === "rcd");

  const updateRow = (rowIndex: number, update: (row: Device[]) => Device[]) =>
    setPanel((current) => ({
      rows: current.rows.map((row, i) => (i === rowIndex ? update(row) : row)),
    }));

  const moveDevice = (rowIndex: number, index: number, direction: -1 | 1) =>
    updateRow(rowIndex, (row) => {
      const next = [...row];
      const [device] = next.splice(index, 1);
      next.splice(index + direction, 0, device!);
      return next;
    });

  const reset = (next: Panel, message: string) => {
    if (window.confirm(message)) {
      setPanel(next);
    }
  };

  const editor = (
    <VStack align="stretch" gap={8} p={{ base: 4, md: 5 }}>
      {panel.rows.map((row, rowIndex) => {
        const placedRow = placeRow(row, rowIndex);
        const used = rowModules(row);
        return (
          <VStack key={rowIndex} align="stretch" gap={3}>
            <Flex gap={2} align="center">
              <Text fontWeight="600" fontSize="md">
                Row {rowIndex + 1}
              </Text>
              <Badge colorPalette={used === MODULES_PER_ROW ? "green" : "red"}>
                {used} / {MODULES_PER_ROW} modules
              </Badge>
              {panel.rows.length > 1 ? (
                <Button
                  size="xs"
                  variant="ghost"
                  ml="auto"
                  onClick={() =>
                    reset(
                      { rows: panel.rows.filter((_, i) => i !== rowIndex) },
                      `Remove row ${rowIndex + 1}?`,
                    )
                  }
                >
                  <Trash /> Remove row
                </Button>
              ) : null}
            </Flex>
            {placedRow.map((placed, index) => (
              <DeviceEditor
                key={placed.device.id}
                placed={placed}
                rcds={rcds}
                colors={colors}
                codes={codes}
                isFirst={index === 0}
                isLast={index === row.length - 1}
                onChange={(patch) =>
                  updateRow(rowIndex, (current) =>
                    current.map((device) =>
                      device.id === placed.device.id ? { ...device, ...patch } : device,
                    ),
                  )
                }
                onMove={(direction) => moveDevice(rowIndex, index, direction)}
                onRemove={() =>
                  updateRow(rowIndex, (current) =>
                    current.filter((device) => device.id !== placed.device.id),
                  )
                }
              />
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateRow(rowIndex, (current) => [...current, createDevice()])}
            >
              <Plus /> Add switch
            </Button>
          </VStack>
        );
      })}

      {panel.rows.length < MAX_ROWS ? (
        <Button
          variant="outline"
          onClick={() => setPanel((current) => ({ rows: [...current.rows, createEmptyRow()] }))}
        >
          <Plus /> Add row
        </Button>
      ) : null}

      <VStack align="stretch" gap={2}>
        <Text fontWeight="600" fontSize="md">
          How to print
        </Text>
        <List.Root fontSize="sm" color={mutedText} gap={1.5} ps={5}>
          <List.Item>
            Print on A4 in landscape at 100% (“Actual size”), not “Fit to page”. Check the ruler
            measures 100 mm.
          </List.Item>
          <List.Item>
            Strips are {STRIP_WIDTH_MM} × {STRIP_HEIGHT_MM} mm with one cell per {MODULE_WIDTH_MM}{" "}
            mm module. Number labels are {NUMBER_LABEL_WIDTH_MM} × {NUMBER_LABEL_HEIGHT_MM} mm per
            module. Cut along the dashed lines.
          </List.Item>
          <List.Item>
            Codes follow IEC 81346, as used by Dutch installers: S for the main switch, Q for RCDs
            (earth-leakage switches) and F for groups, numbered left to right.
          </List.Item>
          <List.Item>
            Each RCD gets a colour, shared by the groups behind it. Text that doesn’t fit is
            outlined in red.
          </List.Item>
          <List.Item>Your labels are saved in this browser.</List.Item>
        </List.Root>
      </VStack>
    </VStack>
  );

  const preview = (
    <>
      <Flex flex="none" align="center" gap={3} px={{ base: 3, md: 5 }} pt={3} wrap="wrap">
        <Checkbox.Root
          size="sm"
          checked={showStripCodes}
          onCheckedChange={(details) => setShowStripCodes(details.checked === true)}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Show codes on strips</Checkbox.Label>
        </Checkbox.Root>
        <Button size="xs" variant="outline" ml="auto" onClick={() => setFullscreen(true)}>
          <CornersOut /> Full screen
        </Button>
      </Flex>
      <ScaledPreview>
        <Sheet panel={panel} showStripCodes={showStripCodes} />
      </ScaledPreview>
    </>
  );

  return (
    <>
      <style>{printStyles}</style>
      <Flex direction="column" h="100dvh" bg={canvasBg}>
        <Flex
          as="header"
          flex="none"
          align="center"
          gap={3}
          h={14}
          px={{ base: 3, md: 4 }}
          bg={panelBg}
          borderBottomWidth="1px"
          borderColor={border}
        >
          <AvatarNavigation />
          <Text fontFamily="heading" fontWeight="600" fontSize="md" truncate>
            Fuse Box Labeler
          </Text>
          <HStack gap={2} ml="auto" flex="none">
            <IconButton
              aria-label="Load example"
              title="Load example"
              size="sm"
              variant="ghost"
              onClick={() => reset(examplePanel, "Replace your labels with the example?")}
            >
              <ArrowCounterClockwise />
            </IconButton>
            <IconButton
              aria-label="Start blank"
              title="Start blank"
              size="sm"
              variant="ghost"
              onClick={() =>
                reset({ rows: [createEmptyRow(), createEmptyRow()] }, "Clear all labels?")
              }
            >
              <FilePlus />
            </IconButton>
            <Button size="sm" colorPalette="blue" onClick={() => window.print()}>
              <Printer /> Print
            </Button>
          </HStack>
        </Flex>

        <HStack
          display={{ base: "flex", lg: "none" }}
          flex="none"
          gap={1}
          p={2}
          bg={panelBg}
          borderBottomWidth="1px"
          borderColor={border}
        >
          {(["edit", "preview"] as const).map((tab) => (
            <Button
              key={tab}
              flex={1}
              size="sm"
              variant={mobileTab === tab ? "subtle" : "ghost"}
              onClick={() => setMobileTab(tab)}
            >
              {tab === "edit" ? <PencilSimple /> : <Eye />}
              {tab === "edit" ? "Edit" : "Preview"}
            </Button>
          ))}
        </HStack>

        {isDesktop ? (
          <Splitter.Root
            flex={1}
            minH={0}
            panels={[
              { id: "editor", minSize: 22, maxSize: 60 },
              { id: "preview", minSize: 35 },
            ]}
            defaultSize={loadSplitSizes()}
            onResizeEnd={(details) => saveSplitSizes(details.size)}
          >
            <Splitter.Panel id="editor" overflowY="auto" bg={panelBg}>
              {editor}
            </Splitter.Panel>
            <Splitter.ResizeTrigger id="editor:preview" aria-label="Resize panels">
              <Splitter.ResizeTriggerSeparator />
              <Splitter.ResizeTriggerIndicator />
            </Splitter.ResizeTrigger>
            <Splitter.Panel id="preview" display="flex" flexDirection="column" minW={0}>
              {preview}
            </Splitter.Panel>
          </Splitter.Root>
        ) : (
          <Flex
            flex={1}
            minH={0}
            direction="column"
            bg={mobileTab === "edit" ? panelBg : undefined}
          >
            {mobileTab === "edit" ? (
              <Box flex={1} minH={0} overflowY="auto">
                {editor}
              </Box>
            ) : (
              preview
            )}
          </Flex>
        )}
      </Flex>
      {fullscreen ? (
        <FullscreenPreview onClose={closeFullscreen}>
          <Sheet panel={panel} showStripCodes={showStripCodes} />
        </FullscreenPreview>
      ) : null}
      {printRoot
        ? createPortal(<Sheet panel={panel} showStripCodes={showStripCodes} />, printRoot)
        : null}
    </>
  );
}
