export type IngredientKey = "flour" | "water" | "salt" | "yeast";

export type Ingredient = {
  key: IngredientKey;
  label: string;
  /** Baker's percentage relative to flour (flour is always 100). */
  bakersPercent: number;
  /** Weight in grams for the reference yield (`REFERENCE_LOAF_COUNT` loaves). */
  baseGrams: number;
  /** Rounding decimals for the scaled weight in grams. */
  decimals: number;
};

export type Phase = {
  id: string;
  name: string;
  /** Duration bounds and default, in minutes. */
  minMinutes: number;
  maxMinutes: number;
  defaultMinutes: number;
  note?: string;
  /** Longer explanation surfaced in an info tooltip. */
  tooltip?: string;
  /** When true, the UI exposes a slider between min and max. */
  adjustable: boolean;
};

export type BreadRecipe = {
  id: "saturday" | "overnight";
  name: string;
  shortName: string;
  /** Default clock time for “Start at” (HH:mm, local). */
  defaultStartTime: string;
  loafWeightGrams: number;
  ingredients: Ingredient[];
  phases: Phase[];
};

/** Approximate baked loaf weight from the book (~1½ lb). */
export const LOAF_WEIGHT_GRAMS = 680;
/** Recipe cards are written for this many loaves (~1 kg flour). */
export const REFERENCE_LOAF_COUNT = 2;
/** Oven preheat reminder before bake (matches Dutch-oven tip copy). */
export const PREHEAT_MINUTES = 45;
export const PREHEAT_TEMP_LABEL = "245°C / 475°F";

export const breadRecipes: BreadRecipe[] = [
  {
    id: "saturday",
    name: "Saturday White Bread",
    shortName: "Saturday",
    defaultStartTime: "09:30",
    loafWeightGrams: LOAF_WEIGHT_GRAMS,
    ingredients: [
      {
        key: "flour",
        label: "White flour (all-purpose)",
        bakersPercent: 100,
        baseGrams: 1000,
        decimals: 0,
      },
      {
        key: "water",
        label: "Water (32–35°C / 90–95°F)",
        bakersPercent: 72,
        baseGrams: 720,
        decimals: 0,
      },
      {
        key: "salt",
        label: "Fine sea salt",
        bakersPercent: 2.1,
        baseGrams: 21,
        decimals: 1,
      },
      {
        key: "yeast",
        label: "Instant dried yeast",
        bakersPercent: 0.4,
        baseGrams: 4,
        decimals: 1,
      },
    ],
    phases: [
      {
        id: "autolyse",
        name: "Autolyse",
        minMinutes: 20,
        maxMinutes: 30,
        defaultMinutes: 30,
        note: "Flour + water only, covered.",
        tooltip:
          "Mix flour and warm water until just combined. Rest 20–30 minutes before adding salt and yeast — this builds gluten with almost no kneading.",
        adjustable: false,
      },
      {
        id: "mix",
        name: "Mix",
        minMinutes: 10,
        maxMinutes: 15,
        defaultMinutes: 15,
        note: "Add salt and yeast; pincer method.",
        tooltip:
          "Sprinkle salt and yeast over the dough, then mix by hand with the pincer method and folds until everything is fully enclosed and the dough tightens.",
        adjustable: false,
      },
      {
        id: "bulk",
        name: "Bulk ferment",
        minMinutes: 5 * 60,
        maxMinutes: 5 * 60,
        defaultMinutes: 5 * 60,
        note: "About 5 hours at room temperature.",
        tooltip:
          "Leave the dough covered until it is roughly 2½ to 3 times its original volume — about 5 hours for this same-day formula.",
        adjustable: false,
      },
      {
        id: "shape",
        name: "Divide & shape",
        minMinutes: 15,
        maxMinutes: 15,
        defaultMinutes: 15,
        note: "Two medium-tight balls into baskets.",
        tooltip:
          "Tip the dough onto a floured surface, divide into equal pieces, and shape each into a medium-tight ball. Place seam-side up in proofing baskets.",
        adjustable: false,
      },
      {
        id: "proof",
        name: "Proof",
        minMinutes: 75,
        maxMinutes: 75,
        defaultMinutes: 75,
        note: "About 1¼ hours at ~21°C / 70°F.",
        tooltip:
          "Final proof until the dough springs back slowly when poked. Warmer kitchens finish closer to an hour.",
        adjustable: false,
      },
    ],
  },
  {
    id: "overnight",
    name: "Overnight White Bread",
    shortName: "Overnight",
    defaultStartTime: "19:00",
    loafWeightGrams: LOAF_WEIGHT_GRAMS,
    ingredients: [
      {
        key: "flour",
        label: "White flour (all-purpose)",
        bakersPercent: 100,
        baseGrams: 1000,
        decimals: 0,
      },
      {
        key: "water",
        label: "Water (32–35°C / 90–95°F)",
        bakersPercent: 78,
        baseGrams: 780,
        decimals: 0,
      },
      {
        key: "salt",
        label: "Fine sea salt",
        bakersPercent: 2.2,
        baseGrams: 22,
        decimals: 1,
      },
      {
        key: "yeast",
        label: "Instant dried yeast",
        bakersPercent: 0.08,
        baseGrams: 0.8,
        decimals: 1,
      },
    ],
    phases: [
      {
        id: "autolyse",
        name: "Autolyse",
        minMinutes: 20,
        maxMinutes: 30,
        defaultMinutes: 30,
        note: "Flour + water only, covered.",
        tooltip:
          "Mix flour and warm water until just combined. Rest 20–30 minutes before adding salt and yeast.",
        adjustable: false,
      },
      {
        id: "mix",
        name: "Mix",
        minMinutes: 10,
        maxMinutes: 15,
        defaultMinutes: 15,
        note: "Target dough temp 25–26°C / 77–78°F.",
        tooltip:
          "Mix in salt and yeast with the pincer method until integrated. Aim for a final dough temperature of 77–78°F (25–26°C), then fold two or three times in the first 1½ hours.",
        adjustable: false,
      },
      {
        id: "bulk",
        name: "Bulk ferment",
        minMinutes: 12 * 60,
        maxMinutes: 14 * 60,
        defaultMinutes: 13 * 60,
        note: "12–14 hours overnight at room temperature.",
        tooltip:
          "After the last fold, cover and leave overnight. Ready when 2½ to 3 times original volume — usually 12–14 hours after mixing.",
        adjustable: false,
      },
      {
        id: "shape",
        name: "Divide & shape",
        minMinutes: 15,
        maxMinutes: 15,
        defaultMinutes: 15,
        note: "Two medium-tight balls into baskets.",
        tooltip:
          "Tip onto a floured surface, divide into two equal pieces, and shape into medium-tight balls for the baskets.",
        adjustable: false,
      },
      {
        id: "proof",
        name: "Proof",
        minMinutes: 75,
        maxMinutes: 75,
        defaultMinutes: 75,
        note: "About 1¼ hours at ~21°C / 70°F.",
        tooltip:
          "Proof about 1¼ hours at 70°F / 21°C. If the kitchen is warmer, check around the 1-hour mark.",
        adjustable: false,
      },
    ],
  },
] as const satisfies BreadRecipe[];

export function getRecipeById(id: BreadRecipe["id"]): BreadRecipe {
  const recipe = breadRecipes.find((entry) => entry.id === id);
  if (!recipe) {
    throw new Error(`Unknown bread recipe: ${id}`);
  }
  return recipe;
}

export function sumBakersPercent(recipe: BreadRecipe): number {
  return recipe.ingredients.reduce((sum, ingredient) => sum + ingredient.bakersPercent, 0);
}

export type ScaledIngredient = Ingredient & {
  grams: number;
};

export function scaleIngredients(recipe: BreadRecipe, loafCount: number): ScaledIngredient[] {
  const scale = loafCount / REFERENCE_LOAF_COUNT;

  return recipe.ingredients.map((ingredient) => {
    const raw = ingredient.baseGrams * scale;
    const factor = 10 ** ingredient.decimals;
    const grams = Math.round(raw * factor) / factor;
    return { ...ingredient, grams };
  });
}

export type PhaseDurationMap = Record<string, number>;

export function defaultPhaseDurations(recipe: BreadRecipe): PhaseDurationMap {
  return Object.fromEntries(recipe.phases.map((phase) => [phase.id, phase.defaultMinutes]));
}

export function resolvePhaseMinutes(
  recipe: BreadRecipe,
  overrides: PhaseDurationMap,
): { phase: Phase; minutes: number }[] {
  return recipe.phases.map((phase) => {
    const override = overrides[phase.id];
    const minutes =
      typeof override === "number"
        ? Math.min(phase.maxMinutes, Math.max(phase.minMinutes, override))
        : phase.defaultMinutes;
    return { phase, minutes };
  });
}

export function totalMinutes(
  recipe: BreadRecipe,
  overrides: PhaseDurationMap,
): { active: number; inactive: number; total: number } {
  const resolved = resolvePhaseMinutes(recipe, overrides);
  let active = 0;
  let inactive = 0;

  for (const { phase, minutes } of resolved) {
    if (phase.id === "mix" || phase.id === "shape") {
      active += minutes;
    } else {
      inactive += minutes;
    }
  }

  return { active, inactive, total: active + inactive };
}

export type ScheduleStep = {
  id: string;
  label: string;
  start: Date;
  end: Date;
  minutes: number;
  note?: string;
  tooltip?: string;
};

export function buildPreheatStep(bakeAt: Date): ScheduleStep {
  const start = new Date(bakeAt.getTime() - PREHEAT_MINUTES * 60_000);
  return {
    id: "preheat",
    label: `Preheat Dutch oven to ${PREHEAT_TEMP_LABEL}`,
    start,
    end: new Date(bakeAt),
    minutes: PREHEAT_MINUTES,
    note: `Dutch ovens need at least ${formatDuration(PREHEAT_MINUTES)} at ${PREHEAT_TEMP_LABEL}.`,
    tooltip:
      "Start preheating while the loaves finish proofing so the pot is screaming hot when you score and load.",
  };
}

export function buildSchedule(args: {
  recipe: BreadRecipe;
  overrides: PhaseDurationMap;
  startAt: Date;
}): ScheduleStep[] {
  const { recipe, overrides, startAt } = args;
  const resolved = resolvePhaseMinutes(recipe, overrides);
  const steps: ScheduleStep[] = [];
  let cursor = new Date(startAt);

  for (const { phase, minutes } of resolved) {
    const start = new Date(cursor);
    const end = new Date(cursor.getTime() + minutes * 60_000);
    steps.push({
      id: phase.id,
      label: phase.name,
      start,
      end,
      minutes,
      note: phase.note,
      tooltip: phase.tooltip,
    });
    cursor = end;
  }

  // Oven reminder that overlaps late proof — does not shift dough steps.
  if (steps.length > 0) {
    steps.push(buildPreheatStep(cursor));
  }

  return steps;
}

/** Bake starts when the final dough phase (proof) ends — ignore the preheat overlay. */
export function bakeTimeFromSchedule(schedule: ScheduleStep[]): Date | undefined {
  const lastDough = [...schedule].reverse().find((step) => step.id !== "preheat");
  return lastDough ? new Date(lastDough.end) : undefined;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) {
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }

  const hourLabel = hours === 1 ? "1 hour" : `${hours} hours`;
  return `${hourLabel} ${remainder} min`;
}

export function toDatetimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function roundUpToNextHalfHour(date: Date): Date {
  const next = new Date(date);
  next.setSeconds(0, 0);
  const minutes = next.getMinutes();
  if (minutes === 0 || minutes === 30) {
    return next;
  }
  if (minutes < 30) {
    next.setMinutes(30);
    return next;
  }
  next.setHours(next.getHours() + 1, 0, 0, 0);
  return next;
}

export function formatScheduleTime(date: Date): string {
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
