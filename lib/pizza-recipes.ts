export type IngredientKey = "flour" | "water" | "salt" | "yeast";

export type Ingredient = {
  key: IngredientKey;
  label: string;
  /** Baker's percentage relative to flour (flour is always 100). */
  bakersPercent: number;
  /** Weight in grams for the reference yield (`REFERENCE_PIZZA_COUNT` pizzas). */
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

export type PizzaRecipe = {
  id: "master" | "avpn" | "emergency";
  name: string;
  shortName: string;
  description: string;
  ballWeightGrams: number;
  ingredients: Ingredient[];
  phases: Phase[];
};

export const DOUGH_BALL_GRAMS = 250;
/** Recipe cards are written for this many 250 g balls (~1 kg dough). */
export const REFERENCE_PIZZA_COUNT = 4;

export const pizzaRecipes: PizzaRecipe[] = [
  {
    id: "master",
    name: "Master Neapolitan",
    shortName: "Master",
    description:
      "Long cold room-temp ferment with tiny yeast. Best with Le 5 Stagioni, Caputo Pizzeria, or Polselli Classica 00 flour.",
    ballWeightGrams: DOUGH_BALL_GRAMS,
    ingredients: [
      {
        key: "flour",
        label: "Bread flour or 00 flour",
        bakersPercent: 100,
        baseGrams: 610,
        decimals: 0,
      },
      {
        key: "water",
        label: "Water (21°C / 70°F)",
        bakersPercent: 62.3,
        baseGrams: 380,
        decimals: 0,
      },
      { key: "salt", label: "Fine salt", bakersPercent: 1.99, baseGrams: 12.15, decimals: 2 },
      {
        key: "yeast",
        label: "Instant dry yeast",
        bakersPercent: 0.04,
        baseGrams: 0.24,
        decimals: 2,
      },
    ],
    phases: [
      {
        id: "mix",
        name: "Mix",
        minMinutes: 15,
        maxMinutes: 20,
        defaultMinutes: 20,
        note: "Mix to full gluten development (windowpane).",
        tooltip:
          "Mix until the dough passes the windowpane test: a small piece should stretch into a thin, translucent membrane without tearing.",
        adjustable: false,
      },
      {
        id: "bulk",
        name: "Bulk ferment",
        minMinutes: 20 * 60,
        maxMinutes: 24 * 60,
        defaultMinutes: 20 * 60,
        note: "21°C / 70°F, covered, misted with water.",
        tooltip:
          "The long, cool bulk ferment builds most of the flavor. Keep the dough at 21°C / 70°F, covered and lightly misted so the surface doesn't dry out.",
        adjustable: false,
      },
      {
        id: "divide",
        name: "Divide & preshape",
        minMinutes: 15,
        maxMinutes: 15,
        defaultMinutes: 15,
        note: "250 g balls, covered.",
        tooltip:
          "Divide into 250 g portions and shape into tight, smooth balls. Cover them so they don't form a skin.",
        adjustable: false,
      },
      {
        id: "proof",
        name: "Proof",
        minMinutes: 3 * 60,
        maxMinutes: 3 * 60,
        defaultMinutes: 3 * 60,
        note: "21°C / 70°F.",
        tooltip:
          "Final proof at room temperature. The balls should relax, roughly double, and feel airy when gently poked.",
        adjustable: false,
      },
    ],
  },
  {
    id: "avpn",
    name: "AVPN Neapolitan",
    shortName: "AVPN",
    description:
      "Associazione Verace Pizza Napoletana style. Prefer 00 flour with 12–13% protein (W 280–310) and fresh yeast.",
    ballWeightGrams: DOUGH_BALL_GRAMS,
    ingredients: [
      {
        key: "flour",
        label: "00 flour (12–13% protein)",
        bakersPercent: 100,
        baseGrams: 620,
        decimals: 0,
      },
      {
        key: "water",
        label: "Water (21°C / 70°F)",
        bakersPercent: 64.52,
        baseGrams: 400,
        decimals: 0,
      },
      { key: "salt", label: "Fine salt", bakersPercent: 2.74, baseGrams: 17, decimals: 1 },
      { key: "yeast", label: "Fresh yeast", bakersPercent: 0.11, baseGrams: 0.7, decimals: 2 },
    ],
    phases: [
      {
        id: "mix",
        name: "Mix",
        minMinutes: 15,
        maxMinutes: 20,
        defaultMinutes: 20,
        note: "By hand 5–7 min, or ~15 min by machine.",
        tooltip:
          "Knead by hand for 5–7 minutes or about 15 minutes in a spiral mixer, until the dough is smooth and elastic.",
        adjustable: false,
      },
      {
        id: "bulk",
        name: "Bulk ferment",
        minMinutes: 12 * 60,
        maxMinutes: 18 * 60,
        defaultMinutes: 15 * 60,
        note: "20–20.5°C / 68–69°F.",
        tooltip:
          "AVPN prescribes a long first rise of the whole dough mass at 20–20.5°C / 68–69°F, covered.",
        adjustable: false,
      },
      {
        id: "divide",
        name: "Divide & preshape",
        minMinutes: 15,
        maxMinutes: 15,
        defaultMinutes: 15,
        note: "250 g balls.",
        tooltip:
          "Form 250 g balls (panetti) with a smooth, closed surface and place them in a dough box.",
        adjustable: false,
      },
      {
        id: "proof",
        name: "Proof",
        minMinutes: 6 * 60,
        maxMinutes: 8 * 60,
        defaultMinutes: 7 * 60,
        note: "20–20.5°C / 68–69°F.",
        tooltip:
          "Second rise in the dough box at cellar temperature until the balls are soft and fully relaxed.",
        adjustable: false,
      },
    ],
  },
  {
    id: "emergency",
    name: "Emergency Neapolitan",
    shortName: "Emergency",
    description:
      "Same-day dough. Warm water (38°C / 100°F) and higher yeast make it ready in about 2½ hours.",
    ballWeightGrams: DOUGH_BALL_GRAMS,
    ingredients: [
      {
        key: "flour",
        label: "Bread flour or 00 flour",
        bakersPercent: 100,
        baseGrams: 585,
        decimals: 0,
      },
      {
        key: "water",
        label: "Water (38°C / 100°F)",
        bakersPercent: 68.38,
        baseGrams: 400,
        decimals: 0,
      },
      { key: "salt", label: "Fine salt", bakersPercent: 3.42, baseGrams: 20, decimals: 1 },
      {
        key: "yeast",
        label: "Instant dry yeast",
        bakersPercent: 1,
        baseGrams: 5.85,
        decimals: 2,
      },
    ],
    phases: [
      {
        id: "mix",
        name: "Mix",
        minMinutes: 10,
        maxMinutes: 15,
        defaultMinutes: 15,
        note: "Mix to full gluten development (windowpane).",
        tooltip:
          "Warm water (38°C / 100°F) jump-starts the yeast. Mix until the dough passes the windowpane test.",
        adjustable: false,
      },
      {
        id: "rest",
        name: "Bench rest",
        minMinutes: 20,
        maxMinutes: 20,
        defaultMinutes: 20,
        note: "Covered.",
        tooltip: "A short covered rest lets the gluten relax before dividing.",
        adjustable: false,
      },
      {
        id: "divide",
        name: "Divide & preshape",
        minMinutes: 15,
        maxMinutes: 15,
        defaultMinutes: 15,
        note: "250 g balls.",
        tooltip: "Divide into 250 g portions and shape into tight, smooth balls.",
        adjustable: false,
      },
      {
        id: "proof",
        name: "Proof",
        minMinutes: 2 * 60,
        maxMinutes: 2 * 60,
        defaultMinutes: 2 * 60,
        note: "21°C / 70°F, covered.",
        tooltip:
          "The higher yeast amount makes this proof fast. The balls are ready when they look puffy and relaxed.",
        adjustable: false,
      },
    ],
  },
] as const satisfies PizzaRecipe[];

export function getRecipeById(id: PizzaRecipe["id"]): PizzaRecipe {
  const recipe = pizzaRecipes.find((entry) => entry.id === id);
  if (!recipe) {
    throw new Error(`Unknown pizza recipe: ${id}`);
  }
  return recipe;
}

export function sumBakersPercent(recipe: PizzaRecipe): number {
  return recipe.ingredients.reduce((sum, ingredient) => sum + ingredient.bakersPercent, 0);
}

export type ScaledIngredient = Ingredient & {
  grams: number;
};

export function scaleIngredients(recipe: PizzaRecipe, pizzaCount: number): ScaledIngredient[] {
  const scale = pizzaCount / REFERENCE_PIZZA_COUNT;

  return recipe.ingredients.map((ingredient) => {
    const raw = ingredient.baseGrams * scale;
    const factor = 10 ** ingredient.decimals;
    const grams = Math.round(raw * factor) / factor;
    return { ...ingredient, grams };
  });
}

export type PhaseDurationMap = Record<string, number>;

export function defaultPhaseDurations(recipe: PizzaRecipe): PhaseDurationMap {
  return Object.fromEntries(recipe.phases.map((phase) => [phase.id, phase.defaultMinutes]));
}

export function resolvePhaseMinutes(
  recipe: PizzaRecipe,
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
  recipe: PizzaRecipe,
  overrides: PhaseDurationMap,
): { active: number; inactive: number; total: number } {
  const resolved = resolvePhaseMinutes(recipe, overrides);
  let active = 0;
  let inactive = 0;

  for (const { phase, minutes } of resolved) {
    if (phase.id === "mix" || phase.id === "divide") {
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

export function buildSchedule(args: {
  recipe: PizzaRecipe;
  overrides: PhaseDurationMap;
  bakeAt: Date;
}): ScheduleStep[] {
  const { recipe, overrides, bakeAt } = args;
  const resolved = resolvePhaseMinutes(recipe, overrides);
  const steps: ScheduleStep[] = [];
  let cursor = new Date(bakeAt);

  for (let index = resolved.length - 1; index >= 0; index -= 1) {
    const { phase, minutes } = resolved[index]!;
    const end = new Date(cursor);
    const start = new Date(cursor.getTime() - minutes * 60_000);
    steps.unshift({
      id: phase.id,
      label: phase.name,
      start,
      end,
      minutes,
      note: phase.note,
      tooltip: phase.tooltip,
    });
    cursor = start;
  }

  return steps;
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
