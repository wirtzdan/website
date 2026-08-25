import { expect, test } from "vite-plus/test";

import {
  BAKE_EVENT_MINUTES,
  BAKE_PREHEAT_ALARM_MINUTES,
  buildPizzaCalendar,
  pizzaCalendarFileName,
} from "./pizza-calendar";
import { buildSchedule, getRecipeById, scaleIngredients } from "./pizza-recipes";

const recipe = getRecipeById("emergency");
const bakeAt = new Date("2026-08-26T18:00:00.000Z");
const generatedAt = new Date("2026-08-25T08:00:00.000Z");
const pizzaCount = 2;
const ingredients = scaleIngredients(recipe, pizzaCount);
const schedule = buildSchedule({ recipe, overrides: {}, bakeAt });

function calendar() {
  return buildPizzaCalendar({
    recipe,
    pizzaCount,
    ingredients,
    schedule,
    bakeAt,
    generatedAt,
  });
}

function unfolded(ics: string): string {
  return ics.replace(/\r\n /g, "");
}

test("writes a publishable calendar with one event per phase plus bake", () => {
  const ics = calendar();

  expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
  expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  expect(ics).toContain("METHOD:PUBLISH");
  expect(ics.match(/BEGIN:VEVENT/g)?.length).toBe(schedule.length + 1);
  expect(unfolded(ics)).toContain("SUMMARY:Pizza: Mix");
  expect(unfolded(ics)).toContain("SUMMARY:Pizza: Bench rest");
  expect(unfolded(ics)).toContain("SUMMARY:Pizza: Divide & preshape");
  expect(unfolded(ics)).toContain("SUMMARY:Pizza: Proof");
  expect(unfolded(ics)).toContain("SUMMARY:Pizza: Bake");
});

test("uses UTC timestamps that match the working-backwards schedule", () => {
  const ics = unfolded(calendar());
  const mix = schedule.find((step) => step.id === "mix");
  if (!mix) {
    throw new Error("expected mix step");
  }

  expect(ics).toContain("DTSTAMP:20260825T080000Z");
  expect(ics).toContain(`DTSTART:${toIcsUtc(mix.start)}`);
  expect(ics).toContain(`DTEND:${toIcsUtc(mix.end)}`);
  expect(ics).toContain(`DTSTART:${toIcsUtc(bakeAt)}`);
  expect(ics).toContain(
    `DTEND:${toIcsUtc(new Date(bakeAt.getTime() + BAKE_EVENT_MINUTES * 60_000))}`,
  );
});

test("marks hands-on steps busy and long waits free", () => {
  const ics = unfolded(calendar());

  expect(eventProperty(ics, "Pizza: Mix", "TRANSP")).toBe("OPAQUE");
  expect(eventProperty(ics, "Pizza: Divide & preshape", "TRANSP")).toBe("OPAQUE");
  expect(eventProperty(ics, "Pizza: Bake", "TRANSP")).toBe("OPAQUE");
  expect(eventProperty(ics, "Pizza: Bench rest", "TRANSP")).toBe("TRANSPARENT");
  expect(eventProperty(ics, "Pizza: Proof", "TRANSP")).toBe("TRANSPARENT");
});

test("alarms fire at mix, divide, bake, and oven preheat", () => {
  const ics = unfolded(calendar());

  expect(eventHasAlarm(ics, "Pizza: Mix", "-PT0S")).toBe(true);
  expect(eventHasAlarm(ics, "Pizza: Divide & preshape", "-PT0S")).toBe(true);
  expect(eventHasAlarm(ics, "Pizza: Bake", "-PT0S")).toBe(true);
  expect(eventHasAlarm(ics, "Pizza: Bake", `-PT${BAKE_PREHEAT_ALARM_MINUTES}M`)).toBe(true);
  expect(eventHasAlarm(ics, "Pizza: Proof", "-PT0S")).toBe(false);
});

test("puts scaled ingredients on the mix event", () => {
  const ics = unfolded(calendar());
  const description = eventProperty(ics, "Pizza: Mix", "DESCRIPTION");

  expect(description).toContain("Emergency Neapolitan · 2 pizzas");
  expect(description).toContain("Ingredients:");
  expect(description).toContain("Bread flour or 00 flour: 293 g");
});

test("escapes commas and semicolons in event text", () => {
  const ics = unfolded(
    buildPizzaCalendar({
      recipe,
      pizzaCount,
      ingredients,
      bakeAt,
      generatedAt,
      schedule: [
        {
          id: "mix",
          label: "Mix, knead; rest",
          start: bakeAt,
          end: new Date(bakeAt.getTime() + 15 * 60_000),
          minutes: 15,
        },
      ],
    }),
  );

  expect(ics).toContain("SUMMARY:Pizza: Mix\\, knead\\; rest");
});

test("names the file from the recipe and local bake day", () => {
  const localBake = new Date(2026, 7, 26, 18, 0, 0);
  expect(pizzaCalendarFileName(recipe, localBake)).toBe("pizza-emergency-2026-08-26.ics");
  expect(pizzaCalendarFileName(getRecipeById("master"), localBake)).toBe(
    "pizza-master-2026-08-26.ics",
  );
});

function toIcsUtc(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function eventBlocks(ics: string): string[] {
  return ics
    .split("BEGIN:VEVENT\r\n")
    .slice(1)
    .map((block) => `BEGIN:VEVENT\r\n${block}`);
}

function eventProperty(ics: string, summary: string, name: string): string {
  const block = eventBlocks(ics).find((candidate) => candidate.includes(`SUMMARY:${summary}`));
  if (!block) {
    throw new Error(`Missing event ${summary}`);
  }
  const line = block.split("\r\n").find((candidate) => candidate.startsWith(`${name}:`));
  if (!line) {
    throw new Error(`Missing ${name} on ${summary}`);
  }
  return line.slice(name.length + 1);
}

function eventHasAlarm(ics: string, summary: string, trigger: string): boolean {
  const block = eventBlocks(ics).find((candidate) => candidate.includes(`SUMMARY:${summary}`));
  return Boolean(block?.includes(`TRIGGER:${trigger}`));
}
