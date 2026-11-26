import { expect, test } from "vite-plus/test";

import { BAKE_EVENT_MINUTES, buildPizzaCalendar, pizzaCalendarFileName } from "./pizza-calendar";
import {
  NAAN_PREHEAT_MINUTES,
  PREHEAT_MINUTES,
  buildSchedule,
  getRecipeById,
  scaleIngredients,
  sumBakersPercent,
  type ScheduleStep,
} from "./pizza-recipes";

const recipe = getRecipeById("emergency");
const bakeAt = new Date("2026-08-26T18:00:00.000Z");
const generatedAt = new Date("2026-08-25T08:00:00.000Z");
const pizzaCount = 2;
const ingredients = scaleIngredients(recipe, pizzaCount);
const schedule = buildSchedule({ recipe, overrides: {}, bakeAt });
const preheat = schedule.find((step) => step.id === "preheat");

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
  expect(unfolded(ics)).toContain("SUMMARY:Pizza: Preheat");
  expect(unfolded(ics)).toContain("SUMMARY:Pizza: Bake");
  expect(eventProperty(unfolded(ics), "Pizza: Preheat", "DESCRIPTION")).toContain(
    "Heat the steel\\, stone\\, or pizza oven for about 45 min",
  );
});

test("preheat sits before bake without changing the bake-at anchor", () => {
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
});

test("uses UTC timestamps that match the working-backwards schedule", () => {
  const ics = unfolded(calendar());
  const mix = schedule.find((step) => step.id === "mix");
  if (!mix || !preheat) {
    throw new Error("expected mix and preheat steps");
  }

  expect(ics).toContain("DTSTAMP:20260825T080000Z");
  expect(ics).toContain(`DTSTART:${toIcsUtc(mix.start)}`);
  expect(ics).toContain(`DTEND:${toIcsUtc(mix.end)}`);
  expect(ics).toContain(`DTSTART:${toIcsUtc(preheat.start)}`);
  expect(ics).toContain(`DTEND:${toIcsUtc(preheat.end)}`);
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
  expect(eventProperty(ics, "Pizza: Preheat", "TRANSP")).toBe("TRANSPARENT");
});

test("alarms fire at mix, divide, preheat, and bake", () => {
  const ics = unfolded(calendar());

  expect(eventHasAlarm(ics, "Pizza: Mix", "-PT0S")).toBe(true);
  expect(eventHasAlarm(ics, "Pizza: Divide & preshape", "-PT0S")).toBe(true);
  expect(eventHasAlarm(ics, "Pizza: Preheat", "-PT0S")).toBe(true);
  expect(eventHasAlarm(ics, "Pizza: Bake", "-PT0S")).toBe(true);
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

const naan = getRecipeById("naan");

function naanGrams(count: number): Record<string, number> {
  return Object.fromEntries(
    scaleIngredients(naan, count).map((ingredient) => [ingredient.key, ingredient.grams]),
  );
}

test("pizza recipes still scale from 4 × 250 g balls", () => {
  const master = scaleIngredients(getRecipeById("master"), 4);
  expect(master.find((ingredient) => ingredient.key === "flour")?.grams).toBe(610);
  expect(master.find((ingredient) => ingredient.key === "water")?.grams).toBe(380);
});

test("naan scales from the 8-piece source yield", () => {
  expect(naanGrams(8)).toEqual({
    flour: 300,
    water: 120,
    yogurt: 120,
    oil: 14,
    salt: 6,
    sugar: 4,
    yeast: 7,
    butter: 42,
  });
  expect(naanGrams(4)).toMatchObject({ flour: 150, water: 60, yogurt: 60, yeast: 3.5, butter: 21 });
  expect(naanGrams(16)).toMatchObject({ flour: 600, water: 240, yogurt: 240, salt: 12, yeast: 14 });
});

test("naan dough excludes the garlic butter finish", () => {
  const dough = scaleIngredients(naan, 8).filter((ingredient) => !ingredient.finish);
  expect(dough.reduce((sum, ingredient) => sum + ingredient.grams, 0)).toBe(571);
  expect(sumBakersPercent(naan)).toBeCloseTo(190.33, 2);
  const flour = naan.ingredients.find((ingredient) => ingredient.key === "flour");
  expect(flour?.tooltip).toContain("300–350 g");
});

test("naan schedule works backwards from bake with a 30 min preheat over the late rise", () => {
  const naanSchedule = buildSchedule({ recipe: naan, overrides: {}, bakeAt });
  const minutes = (step: { start: Date; end: Date }) =>
    (step.end.getTime() - step.start.getTime()) / 60_000;

  expect(naanSchedule.map((step) => step.id)).toEqual([
    "activate",
    "mix",
    "rise",
    "divide",
    "preheat",
  ]);
  const [activate, mix, rise, divide, naanPreheat] = naanSchedule as [
    ScheduleStep,
    ScheduleStep,
    ScheduleStep,
    ScheduleStep,
    ScheduleStep,
  ];
  expect(minutes(activate)).toBe(10);
  expect(minutes(mix)).toBe(10);
  expect(minutes(rise)).toBe(60);
  expect(divide.end.getTime()).toBe(bakeAt.getTime());
  expect(activate.end.getTime()).toBe(mix.start.getTime());
  expect(mix.end.getTime()).toBe(rise.start.getTime());
  expect(rise.end.getTime()).toBe(divide.start.getTime());

  expect(NAAN_PREHEAT_MINUTES).toBe(30);
  expect(naanPreheat.minutes).toBe(30);
  expect(naanPreheat.end.getTime()).toBe(bakeAt.getTime());
  expect(naanPreheat.start.getTime()).toBe(bakeAt.getTime() - 30 * 60_000);
  expect(naanPreheat.start.getTime()).toBeLessThan(rise.end.getTime());
  expect(naanPreheat.start.getTime()).toBeGreaterThan(rise.start.getTime());
  expect(naanPreheat.tooltip).toContain("400–450°C");
});

test("naan rise can be adjusted for climate within 45–90 min", () => {
  const rise = (minutes: number) =>
    buildSchedule({ recipe: naan, overrides: { rise: minutes }, bakeAt }).find(
      (step) => step.id === "rise",
    )?.minutes;
  expect(rise(45)).toBe(45);
  expect(rise(90)).toBe(90);
  expect(rise(180)).toBe(90);
});

test("naan calendar has one event per phase plus bake with the pizza-oven method", () => {
  const naanSchedule = buildSchedule({ recipe: naan, overrides: {}, bakeAt });
  const ics = unfolded(
    buildPizzaCalendar({
      recipe: naan,
      pizzaCount: 8,
      ingredients: scaleIngredients(naan, 8),
      schedule: naanSchedule,
      bakeAt,
      generatedAt,
    }),
  );

  expect(ics.match(/BEGIN:VEVENT/g)?.length).toBe(naanSchedule.length + 1);
  for (const summary of [
    "Naan: Activate yeast",
    "Naan: Mix & knead",
    "Naan: Rise",
    "Naan: Divide & shape",
    "Naan: Preheat",
    "Naan: Bake",
  ]) {
    expect(ics).toContain(`SUMMARY:${summary}`);
  }
  expect(ics).not.toContain("SUMMARY:Pizza:");

  const mix = eventProperty(ics, "Naan: Mix & knead", "DESCRIPTION");
  expect(mix).toContain("Naan (pizza oven) · 8 naan");
  expect(mix).toContain("All-purpose flour: 300 g");
  expect(mix).toContain("Plain yogurt: 120 g");
  expect(mix).toContain("Active dry yeast: 7.0 g");

  const bake = eventProperty(ics, "Naan: Bake", "DESCRIPTION");
  expect(bake).toContain("stone");
  expect(bake).toContain("400–450°C");
  expect(bake).toContain("60–90 seconds");
  expect(bake).toContain("turning once");
  expect(bake).toContain("garlic butter");
  expect(bake).toContain("about 30 min");
  expect(bake.toLowerCase()).not.toContain("skillet");
  expect(bake).not.toContain("430–480°C");
  expect(bake).not.toContain("topping");
  expect(eventProperty(ics, "Naan: Bake", "DTEND")).toBe(
    toIcsUtc(new Date(bakeAt.getTime() + 15 * 60_000)),
  );

  expect(eventProperty(ics, "Naan: Activate yeast", "TRANSP")).toBe("OPAQUE");
  expect(eventProperty(ics, "Naan: Rise", "TRANSP")).toBe("TRANSPARENT");
  expect(eventProperty(ics, "Naan: Preheat", "TRANSP")).toBe("TRANSPARENT");
  expect(eventHasAlarm(ics, "Naan: Activate yeast", "-PT0S")).toBe(true);
  expect(eventHasAlarm(ics, "Naan: Preheat", "-PT0S")).toBe(true);
  expect(eventHasAlarm(ics, "Naan: Bake", "-PT0S")).toBe(true);
  expect(eventHasAlarm(ics, "Naan: Rise", "-PT0S")).toBe(false);
});

test("names the naan calendar file like the pizza ones", () => {
  expect(pizzaCalendarFileName(naan, new Date(2026, 7, 26, 18, 0, 0))).toBe(
    "pizza-naan-2026-08-26.ics",
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
