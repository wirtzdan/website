import {
  formatDuration,
  type BreadRecipe,
  type ScaledIngredient,
  type ScheduleStep,
  bakeTimeFromSchedule,
  PREHEAT_MINUTES,
} from "./bread-recipes";

const CALENDAR_SOURCE_URL = "https://danielwirtz.com/bread";
const ICS_PRODID = "-//Daniel Wirtz//Bread Dough Calculator//EN";
const ICS_LINE_LIMIT = 75;

export const BAKE_EVENT_MINUTES = 45;
/** @deprecated Prefer PREHEAT_MINUTES from bread-recipes; kept for calendar callers. */
export { PREHEAT_MINUTES as BAKE_PREHEAT_ALARM_MINUTES };

const BUSY_STEP_IDS = new Set(["mix", "shape", "bake"]);
const ALARM_AT_START_IDS = new Set(["autolyse", "mix", "shape", "preheat", "bake"]);

export type BreadCalendarInput = {
  recipe: BreadRecipe;
  loafCount: number;
  ingredients: ScaledIngredient[];
  schedule: ScheduleStep[];
  startAt: Date;
  generatedAt?: Date;
};

type CalendarAlarm = {
  trigger: string;
  description: string;
};

type CalendarEvent = {
  uid: string;
  start: Date;
  end: Date;
  summary: string;
  description: string;
  busy: boolean;
  alarms: CalendarAlarm[];
};

export function breadCalendarFileName(recipe: BreadRecipe, startAt: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  const day = `${startAt.getFullYear()}-${pad(startAt.getMonth() + 1)}-${pad(startAt.getDate())}`;
  return `bread-${recipe.shortName.toLowerCase()}-${day}.ics`;
}

export function buildBreadCalendar(input: BreadCalendarInput): string {
  const generatedAt = input.generatedAt ?? new Date();
  const stamp = input.startAt.getTime();
  const bakeAt = bakeTimeFromSchedule(input.schedule);
  if (!bakeAt) {
    throw new Error("Cannot build a bread calendar without schedule steps");
  }
  const events = [
    ...input.schedule.map((step) =>
      toCalendarEvent({
        recipe: input.recipe,
        loafCount: input.loafCount,
        ingredients: input.ingredients,
        stamp,
        step,
      }),
    ),
    bakeCalendarEvent({
      recipe: input.recipe,
      loafCount: input.loafCount,
      stamp,
      bakeAt,
    }),
  ];

  return serializeIcs({ events, generatedAt });
}

function toCalendarEvent(args: {
  recipe: BreadRecipe;
  loafCount: number;
  ingredients: ScaledIngredient[];
  stamp: number;
  step: ScheduleStep;
}): CalendarEvent {
  const { recipe, loafCount, ingredients, stamp, step } = args;
  const lines = [
    eventHeading({ recipe, loafCount }),
    step.note,
    step.tooltip,
    step.id === "autolyse" || step.id === "mix" ? ingredientBlock(ingredients) : undefined,
  ].filter((line): line is string => Boolean(line));

  return {
    uid: eventUid({ recipeId: recipe.id, stepId: step.id, stamp }),
    start: step.start,
    end: step.end,
    summary: `Bread: ${step.label}`,
    description: lines.join("\n\n"),
    busy: BUSY_STEP_IDS.has(step.id),
    alarms: alarmsFor(step.id, step.label),
  };
}

function bakeCalendarEvent(args: {
  recipe: BreadRecipe;
  loafCount: number;
  stamp: number;
  bakeAt: Date;
}): CalendarEvent {
  const { recipe, loafCount, stamp, bakeAt } = args;
  return {
    uid: eventUid({ recipeId: recipe.id, stepId: "bake", stamp }),
    start: bakeAt,
    end: new Date(bakeAt.getTime() + BAKE_EVENT_MINUTES * 60_000),
    summary: "Bread: Bake",
    description: [
      eventHeading({ recipe, loafCount }),
      `About ${formatDuration(BAKE_EVENT_MINUTES)} covered/uncovered in a preheated Dutch oven.`,
      `Preheat Dutch ovens to 245°C / 475°F for at least ${formatDuration(PREHEAT_MINUTES)} before baking.`,
    ].join("\n\n"),
    busy: true,
    alarms: alarmsFor("bake", "Bake"),
  };
}

function eventHeading(args: { recipe: BreadRecipe; loafCount: number }): string {
  const loafLabel = args.loafCount === 1 ? "1 loaf" : `${args.loafCount} loaves`;
  return `${args.recipe.name} · ${loafLabel}`;
}

function ingredientBlock(ingredients: ScaledIngredient[]): string {
  const lines = ingredients.map((ingredient) => {
    const grams =
      ingredient.decimals === 0
        ? `${ingredient.grams}`
        : ingredient.grams.toFixed(ingredient.decimals);
    return `- ${ingredient.label}: ${grams} g`;
  });
  return ["Ingredients:", ...lines].join("\n");
}

function alarmsFor(stepId: string, label: string): CalendarAlarm[] {
  if (!ALARM_AT_START_IDS.has(stepId)) {
    return [];
  }
  return [{ trigger: "-PT0S", description: `Time to ${label.toLowerCase()}` }];
}

function eventUid(args: { recipeId: string; stepId: string; stamp: number }): string {
  return `bread-${args.recipeId}-${args.stepId}-${args.stamp}@danielwirtz.com`;
}

function serializeIcs(args: { events: CalendarEvent[]; generatedAt: Date }): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${ICS_PRODID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...args.events.flatMap((event) => serializeEvent({ event, generatedAt: args.generatedAt })),
    "END:VCALENDAR",
  ];
  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
}

function serializeEvent(args: { event: CalendarEvent; generatedAt: Date }): string[] {
  const { event, generatedAt } = args;
  return [
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${toIcsUtc(generatedAt)}`,
    `DTSTART:${toIcsUtc(event.start)}`,
    `DTEND:${toIcsUtc(event.end)}`,
    `SUMMARY:${escapeIcsText(event.summary)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `URL:${CALENDAR_SOURCE_URL}`,
    `TRANSP:${event.busy ? "OPAQUE" : "TRANSPARENT"}`,
    ...event.alarms.flatMap((alarm) => [
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeIcsText(alarm.description)}`,
      `TRIGGER:${alarm.trigger}`,
      "END:VALARM",
    ]),
    "END:VEVENT",
  ];
}

function toIcsUtc(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldIcsLine(line: string): string {
  if (line.length <= ICS_LINE_LIMIT) {
    return line;
  }

  const parts: string[] = [line.slice(0, ICS_LINE_LIMIT)];
  let remaining = line.slice(ICS_LINE_LIMIT);
  while (remaining.length > 0) {
    parts.push(` ${remaining.slice(0, ICS_LINE_LIMIT - 1)}`);
    remaining = remaining.slice(ICS_LINE_LIMIT - 1);
  }
  return parts.join("\r\n");
}
