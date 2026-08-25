import {
  formatDuration,
  type PizzaRecipe,
  type ScaledIngredient,
  type ScheduleStep,
} from "./pizza-recipes";

const CALENDAR_SOURCE_URL = "https://danielwirtz.com/pizza";
const ICS_PRODID = "-//Daniel Wirtz//Pizza Dough Calculator//EN";
const ICS_LINE_LIMIT = 75;

export const BAKE_EVENT_MINUTES = 45;
export const BAKE_PREHEAT_ALARM_MINUTES = 30;

const BUSY_STEP_IDS = new Set(["mix", "divide", "bake"]);
const ALARM_AT_START_IDS = new Set(["mix", "divide", "bake"]);

export type PizzaCalendarInput = {
  recipe: PizzaRecipe;
  pizzaCount: number;
  ingredients: ScaledIngredient[];
  schedule: ScheduleStep[];
  bakeAt: Date;
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

export function pizzaCalendarFileName(recipe: PizzaRecipe, bakeAt: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  const day = `${bakeAt.getFullYear()}-${pad(bakeAt.getMonth() + 1)}-${pad(bakeAt.getDate())}`;
  return `pizza-${recipe.shortName.toLowerCase()}-${day}.ics`;
}

export function buildPizzaCalendar(input: PizzaCalendarInput): string {
  const generatedAt = input.generatedAt ?? new Date();
  const stamp = input.bakeAt.getTime();
  const events = [
    ...input.schedule.map((step) =>
      toCalendarEvent({
        recipe: input.recipe,
        pizzaCount: input.pizzaCount,
        ingredients: input.ingredients,
        stamp,
        step,
      }),
    ),
    bakeCalendarEvent({
      recipe: input.recipe,
      pizzaCount: input.pizzaCount,
      stamp,
      bakeAt: input.bakeAt,
    }),
  ];

  return serializeIcs({ events, generatedAt });
}

function toCalendarEvent(args: {
  recipe: PizzaRecipe;
  pizzaCount: number;
  ingredients: ScaledIngredient[];
  stamp: number;
  step: ScheduleStep;
}): CalendarEvent {
  const { recipe, pizzaCount, ingredients, stamp, step } = args;
  const lines = [
    eventHeading({ recipe, pizzaCount }),
    step.note,
    step.tooltip,
    step.id === "mix" ? ingredientBlock(ingredients) : undefined,
  ].filter((line): line is string => Boolean(line));

  return {
    uid: eventUid({ recipeId: recipe.id, stepId: step.id, stamp }),
    start: step.start,
    end: step.end,
    summary: `Pizza: ${step.label}`,
    description: lines.join("\n\n"),
    busy: BUSY_STEP_IDS.has(step.id),
    alarms: alarmsFor(step.id, step.label),
  };
}

function bakeCalendarEvent(args: {
  recipe: PizzaRecipe;
  pizzaCount: number;
  stamp: number;
  bakeAt: Date;
}): CalendarEvent {
  const { recipe, pizzaCount, stamp, bakeAt } = args;
  return {
    uid: eventUid({ recipeId: recipe.id, stepId: "bake", stamp }),
    start: bakeAt,
    end: new Date(bakeAt.getTime() + BAKE_EVENT_MINUTES * 60_000),
    summary: "Pizza: Bake",
    description: [
      eventHeading({ recipe, pizzaCount }),
      `About ${formatDuration(BAKE_EVENT_MINUTES)} for stretching, topping, and baking.`,
      "Bake as hot as your oven allows — ideally 430–480°C / 800–900°F for 60–90 seconds in a pizza oven, or on a steel/stone at max heat.",
    ].join("\n\n"),
    busy: true,
    alarms: [
      {
        trigger: `-PT${BAKE_PREHEAT_ALARM_MINUTES}M`,
        description: "Preheat the oven for pizza",
      },
      ...alarmsFor("bake", "Bake"),
    ],
  };
}

function eventHeading(args: { recipe: PizzaRecipe; pizzaCount: number }): string {
  const pizzaLabel = args.pizzaCount === 1 ? "1 pizza" : `${args.pizzaCount} pizzas`;
  return `${args.recipe.name} · ${pizzaLabel}`;
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
  return `pizza-${args.recipeId}-${args.stepId}-${args.stamp}@danielwirtz.com`;
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
