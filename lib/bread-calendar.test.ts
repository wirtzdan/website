import { expect, test } from "vite-plus/test";

import { BAKE_EVENT_MINUTES, breadCalendarFileName, buildBreadCalendar } from "./bread-calendar";
import {
  PREHEAT_MINUTES,
  bakeTimeFromSchedule,
  buildSchedule,
  getRecipeById,
  scaleIngredients,
} from "./bread-recipes";

const recipe = getRecipeById("saturday");
const startAt = new Date("2026-09-14T09:30:00.000Z");
const generatedAt = new Date("2026-09-14T08:00:00.000Z");
const loafCount = 2;
const ingredients = scaleIngredients(recipe, loafCount);
const schedule = buildSchedule({ recipe, overrides: {}, startAt });
const bakeAt = bakeTimeFromSchedule(schedule)!;
const preheat = schedule.find((step) => step.id === "preheat");

function calendar() {
  return buildBreadCalendar({
    recipe,
    loafCount,
    ingredients,
    schedule,
    startAt,
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
  expect(unfolded(ics)).toContain("SUMMARY:Bread: Autolyse");
  expect(unfolded(ics)).toContain("SUMMARY:Bread: Mix");
  expect(unfolded(ics)).toContain("SUMMARY:Bread: Bulk ferment");
  expect(unfolded(ics)).toContain("SUMMARY:Bread: Divide & shape");
  expect(unfolded(ics)).toContain("SUMMARY:Bread: Proof");
  expect(unfolded(ics)).toContain("SUMMARY:Bread: Preheat Dutch oven to 245°C / 475°F");
  expect(unfolded(ics)).toContain("SUMMARY:Bread: Bake");
});

test("preheat overlays late proof without shifting earlier dough steps", () => {
  expect(preheat).toBeDefined();
  expect(preheat!.minutes).toBe(PREHEAT_MINUTES);
  expect(preheat!.end.getTime()).toBe(bakeAt.getTime());
  expect(preheat!.start.getTime()).toBe(bakeAt.getTime() - PREHEAT_MINUTES * 60_000);

  const proof = schedule.find((step) => step.id === "proof");
  const mix = schedule.find((step) => step.id === "mix");
  if (!proof || !mix) {
    throw new Error("expected proof and mix steps");
  }

  expect(proof.end.getTime()).toBe(bakeAt.getTime());
  expect(preheat!.start.getTime()).toBeGreaterThan(proof.start.getTime());
  expect(mix.start.getTime()).toBe(startAt.getTime() + 30 * 60_000);
});

test("uses UTC timestamps that match the forward-from-start schedule", () => {
  const ics = unfolded(calendar());
  const autolyse = schedule.find((step) => step.id === "autolyse");
  if (!autolyse || !preheat) {
    throw new Error("expected autolyse and preheat steps");
  }

  expect(autolyse.start.getTime()).toBe(startAt.getTime());
  expect(ics).toContain("DTSTAMP:20260914T080000Z");
  expect(ics).toContain(`DTSTART:${toIcsUtc(autolyse.start)}`);
  expect(ics).toContain(`DTEND:${toIcsUtc(autolyse.end)}`);
  expect(ics).toContain(`DTSTART:${toIcsUtc(preheat.start)}`);
  expect(ics).toContain(`DTEND:${toIcsUtc(preheat.end)}`);
  expect(ics).toContain(`DTSTART:${toIcsUtc(bakeAt)}`);
  expect(ics).toContain(
    `DTEND:${toIcsUtc(new Date(bakeAt.getTime() + BAKE_EVENT_MINUTES * 60_000))}`,
  );
});

test("marks hands-on steps busy and long waits free", () => {
  const ics = unfolded(calendar());

  expect(eventProperty(ics, "Bread: Mix", "TRANSP")).toBe("OPAQUE");
  expect(eventProperty(ics, "Bread: Divide & shape", "TRANSP")).toBe("OPAQUE");
  expect(eventProperty(ics, "Bread: Bake", "TRANSP")).toBe("OPAQUE");
  expect(eventProperty(ics, "Bread: Autolyse", "TRANSP")).toBe("TRANSPARENT");
  expect(eventProperty(ics, "Bread: Bulk ferment", "TRANSP")).toBe("TRANSPARENT");
  expect(eventProperty(ics, "Bread: Proof", "TRANSP")).toBe("TRANSPARENT");
  expect(eventProperty(ics, "Bread: Preheat Dutch oven to 245°C / 475°F", "TRANSP")).toBe(
    "TRANSPARENT",
  );
});

test("alarms fire at autolyse, mix, shape, preheat, and bake", () => {
  const ics = unfolded(calendar());
  const preheatSummary = "Bread: Preheat Dutch oven to 245°C / 475°F";

  expect(eventHasAlarm(ics, "Bread: Autolyse", "-PT0S")).toBe(true);
  expect(eventHasAlarm(ics, "Bread: Mix", "-PT0S")).toBe(true);
  expect(eventHasAlarm(ics, "Bread: Divide & shape", "-PT0S")).toBe(true);
  expect(eventHasAlarm(ics, preheatSummary, "-PT0S")).toBe(true);
  expect(eventHasAlarm(ics, "Bread: Bake", "-PT0S")).toBe(true);
  expect(eventHasAlarm(ics, "Bread: Proof", "-PT0S")).toBe(false);
});

test("puts scaled ingredients on the autolyse event", () => {
  const ics = unfolded(calendar());
  const description = eventProperty(ics, "Bread: Autolyse", "DESCRIPTION");

  expect(description).toContain("Saturday White Bread · 2 loaves");
  expect(description).toContain("Ingredients:");
  expect(description).toContain("White flour (all-purpose): 1000 g");
  expect(description).toContain("Water (32–35°C / 90–95°F): 720 g");
});

test("scales overnight yeast for a single loaf", () => {
  const overnight = getRecipeById("overnight");
  const scaled = scaleIngredients(overnight, 1);
  const yeast = scaled.find((ingredient) => ingredient.key === "yeast");
  expect(yeast?.grams).toBe(0.4);
});

test("overnight schedule starting in the evening bakes the next day", () => {
  const overnight = getRecipeById("overnight");
  const overnightStart = new Date("2026-09-14T19:00:00.000Z");
  const overnightSchedule = buildSchedule({
    recipe: overnight,
    overrides: {},
    startAt: overnightStart,
  });
  const start = overnightSchedule[0];
  const bake = bakeTimeFromSchedule(overnightSchedule);
  if (!start || !bake) {
    throw new Error("expected schedule start and bake");
  }

  expect(start.start.getTime()).toBe(overnightStart.getTime());
  expect(overnightSchedule.find((step) => step.id === "bulk")?.minutes).toBe(13 * 60);
  expect(bake.getUTCDate()).toBe(15);
  expect(overnightSchedule.find((step) => step.id === "preheat")?.end.getTime()).toBe(
    bake.getTime(),
  );
});

test("escapes commas and semicolons in event text", () => {
  const ics = unfolded(
    buildBreadCalendar({
      recipe,
      loafCount,
      ingredients,
      startAt,
      generatedAt,
      schedule: [
        {
          id: "mix",
          label: "Mix, knead; rest",
          start: startAt,
          end: new Date(startAt.getTime() + 15 * 60_000),
          minutes: 15,
        },
      ],
    }),
  );

  expect(ics).toContain("SUMMARY:Bread: Mix\\, knead\\; rest");
});

test("names the file from the recipe and local start day", () => {
  const localStart = new Date(2026, 8, 14, 9, 30, 0);
  expect(breadCalendarFileName(recipe, localStart)).toBe("bread-saturday-2026-09-14.ics");
  expect(breadCalendarFileName(getRecipeById("overnight"), localStart)).toBe(
    "bread-overnight-2026-09-14.ics",
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
