export type IngredientKey =
  | "flour"
  | "water"
  | "salt"
  | "yeast"
  | "sugar"
  | "yogurt"
  | "oil"
  | "butter";

export type Ingredient = {
  key: IngredientKey;
  label: string;
  /** Baker's percentage relative to flour (flour is always 100). */
  bakersPercent: number;
  /** Weight in grams for the recipe's reference yield (`referenceCount`). */
  baseGrams: number;
  /** Rounding decimals for the scaled weight in grams. */
  decimals: number;
  /** Longer explanation surfaced in an info tooltip. */
  tooltip?: string;
  /** Brushed on after baking: listed, but not part of the dough total. */
  finish?: boolean;
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
  id: "master" | "avpn" | "emergency" | "naan";
  name: string;
  shortName: string;
  description: string;
  ballWeightGrams: number;
  ingredients: Ingredient[];
  phases: Phase[];
  /** Yield the ingredient weights are written for. Defaults to `REFERENCE_PIZZA_COUNT`. */
  referenceCount?: number;
  /** What the count control counts. Defaults to pizza / pizzas. */
  item?: RecipeItem;
  /** Bake copy and timing. Defaults to the Neapolitan pizza bake. */
  bake?: RecipeBake;
  /** Where the recipe comes from, credited in the UI. */
  source?: { title: string; author: string; site: string; url: string };
};

export type RecipeItem = {
  /** Capitalised name used in calendar titles, e.g. "Pizza". */
  title: string;
  singular: string;
  plural: string;
  /** Count selected when switching to this recipe from a different item type. */
  defaultCount: number;
};

export type RecipeBake = {
  preheatMinutes: number;
  preheatTooltip: string;
  tooltip: string;
  eventMinutes: number;
  eventSummary: string;
};

export const DOUGH_BALL_GRAMS = 250;
/** Recipe cards are written for this many 250 g balls (~1 kg dough). */
export const REFERENCE_PIZZA_COUNT = 4;
/** Oven preheat reminder before bake (steel/stone typically needs this long). */
export const PREHEAT_MINUTES = 45;
export const BAKE_EVENT_MINUTES = 45;
export const NAAN_REFERENCE_COUNT = 8;
export const NAAN_PREHEAT_MINUTES = 30;

const PIZZA_ITEM: RecipeItem = {
  title: "Pizza",
  singular: "pizza",
  plural: "pizzas",
  defaultCount: 2,
};

const PIZZA_BAKE_TOOLTIP =
  "Bake as hot as your oven allows — ideally 430–480°C / 800–900°F for 60–90 seconds in a pizza oven, or on a steel/stone at max heat.";

const PIZZA_BAKE: RecipeBake = {
  preheatMinutes: PREHEAT_MINUTES,
  preheatTooltip: `Heat the steel, stone, or pizza oven for about ${formatDuration(PREHEAT_MINUTES)}.`,
  tooltip: PIZZA_BAKE_TOOLTIP,
  eventMinutes: BAKE_EVENT_MINUTES,
  eventSummary: `About ${formatDuration(BAKE_EVENT_MINUTES)} for stretching, topping, and baking.`,
};

const NAAN_BAKE_TOOLTIP =
  "Bake one at a time directly on the stone at about 400–450°C / 750–840°F for 60–90 seconds, turning once, until puffed and blistered. Brush with garlic butter right away.";

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
  {
    id: "naan",
    name: "Naan (pizza oven)",
    shortName: "Naan",
    description:
      "Soft yogurt naan, ready in about 1½ hours and baked on the stone of a pizza oven instead of a skillet.",
    ballWeightGrams: 71,
    referenceCount: NAAN_REFERENCE_COUNT,
    item: { title: "Naan", singular: "naan", plural: "naan", defaultCount: NAAN_REFERENCE_COUNT },
    source: {
      title: "Naan (The Best Recipe!)",
      author: "Bee Yinn Low",
      site: "Rasa Malaysia",
      url: "https://rasamalaysia.com/naan/",
    },
    bake: {
      preheatMinutes: NAAN_PREHEAT_MINUTES,
      preheatTooltip: `Heat the pizza oven and stone to about 400–450°C / 750–840°F, about ${formatDuration(NAAN_PREHEAT_MINUTES)}.`,
      tooltip: NAAN_BAKE_TOOLTIP,
      eventMinutes: 15,
      eventSummary: "About 1½ minutes per naan, so 10–15 min for a batch of 8.",
    },
    ingredients: [
      {
        key: "flour",
        label: "All-purpose flour",
        bakersPercent: 100,
        baseGrams: 300,
        decimals: 0,
        tooltip:
          "Start with this amount. If the dough is still sticky (humid kitchen), knead in more a little at a time, up to about 1/6 more — 300–350 g for 8 naan.",
      },
      { key: "water", label: "Warm water", bakersPercent: 40, baseGrams: 120, decimals: 0 },
      { key: "yogurt", label: "Plain yogurt", bakersPercent: 40, baseGrams: 120, decimals: 0 },
      { key: "oil", label: "Oil", bakersPercent: 4.67, baseGrams: 14, decimals: 0 },
      { key: "salt", label: "Fine salt", bakersPercent: 2, baseGrams: 6, decimals: 1 },
      { key: "sugar", label: "Sugar", bakersPercent: 1.33, baseGrams: 4, decimals: 1 },
      {
        key: "yeast",
        label: "Active dry yeast",
        bakersPercent: 2.33,
        baseGrams: 7,
        decimals: 1,
        tooltip: "One standard 7 g packet for 8 naan. Instant yeast works too.",
      },
      {
        key: "butter",
        label: "Melted butter or ghee, with minced garlic (to brush)",
        bakersPercent: 14,
        baseGrams: 42,
        decimals: 0,
        finish: true,
        tooltip:
          "Not part of the dough. Stir minced garlic into the melted butter and brush each naan as it comes out of the oven. Chopped cilantro is optional.",
      },
    ],
    phases: [
      {
        id: "activate",
        name: "Activate yeast",
        minMinutes: 10,
        maxMinutes: 10,
        defaultMinutes: 10,
        note: "Sugar, warm water, and yeast until foamy.",
        tooltip:
          "Stir the sugar and yeast into the warm water and leave it for about 10 minutes, until foamy.",
        adjustable: false,
      },
      {
        id: "mix",
        name: "Mix & knead",
        minMinutes: 5,
        maxMinutes: 10,
        defaultMinutes: 10,
        note: "8–10 min by hand, 5–7 min in a stand mixer.",
        tooltip:
          "Add the yeast mixture, yogurt, salt, and oil to the flour. Knead until smooth and shiny: 8–10 minutes by hand or 5–7 minutes in a stand mixer.",
        adjustable: false,
      },
      {
        id: "rise",
        name: "Rise",
        minMinutes: 45,
        maxMinutes: 90,
        defaultMinutes: 60,
        note: "Warm place, under a damp cloth, until doubled.",
        tooltip:
          "Cover with a damp cloth and leave somewhere warm until doubled, about 1 hour. Faster in a warm kitchen, slower in a cool one.",
        adjustable: false,
      },
      {
        id: "divide",
        name: "Divide & shape",
        minMinutes: 10,
        maxMinutes: 15,
        defaultMinutes: 15,
        note: "Equal portions, rolled to 15 cm / 6 in.",
        tooltip:
          "Divide into equal portions and roll each into a circle about 15 cm / 6 in across.",
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

export function recipeReferenceCount(recipe: PizzaRecipe): number {
  return recipe.referenceCount ?? REFERENCE_PIZZA_COUNT;
}

export function recipeItem(recipe: PizzaRecipe): RecipeItem {
  return recipe.item ?? PIZZA_ITEM;
}

export function recipeBake(recipe: PizzaRecipe): RecipeBake {
  return recipe.bake ?? PIZZA_BAKE;
}

/** "1 pizza", "2 pizzas", "8 naan". */
export function formatItemCount(recipe: PizzaRecipe, count: number): string {
  const item = recipeItem(recipe);
  return `${count} ${count === 1 ? item.singular : item.plural}`;
}

/** Dough ingredients only; finishing ingredients (e.g. butter to brush) are excluded. */
export function doughIngredients<T extends Ingredient>(ingredients: readonly T[]): T[] {
  return ingredients.filter((ingredient) => !ingredient.finish);
}

export function sumBakersPercent(recipe: PizzaRecipe): number {
  return doughIngredients(recipe.ingredients).reduce(
    (sum, ingredient) => sum + ingredient.bakersPercent,
    0,
  );
}

export type ScaledIngredient = Ingredient & {
  grams: number;
};

export function scaleIngredients(recipe: PizzaRecipe, pizzaCount: number): ScaledIngredient[] {
  const scale = pizzaCount / recipeReferenceCount(recipe);

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

export function buildPreheatStep(bakeAt: Date, recipe?: PizzaRecipe): ScheduleStep {
  const bake = recipe ? recipeBake(recipe) : PIZZA_BAKE;
  const start = new Date(bakeAt.getTime() - bake.preheatMinutes * 60_000);
  return {
    id: "preheat",
    label: "Preheat",
    start,
    end: new Date(bakeAt),
    minutes: bake.preheatMinutes,
    tooltip: bake.preheatTooltip,
  };
}

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

  // Oven reminder that overlaps late proof (or rise) — bakeAt stays fixed.
  if (steps.length > 0) {
    steps.push(buildPreheatStep(bakeAt, recipe));
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
