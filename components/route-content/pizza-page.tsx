"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  Alert,
  Box,
  Button,
  DatePicker,
  Field,
  Heading,
  Icon,
  Input,
  NumberInput,
  Portal,
  Select,
  SimpleGrid,
  Table,
  Timeline,
  VStack,
  createListCollection,
  parseDate,
} from "@chakra-ui/react";
import { Calendar, Clock, CookingPot, Fire, Hourglass, Info, Knife } from "phosphor-react";

import Hero from "@/components/hero";
import Section from "@/components/section";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Tooltip } from "@/components/ui/tooltip";
import {
  buildSchedule,
  formatDuration,
  formatScheduleTime,
  pizzaRecipes,
  roundUpToNextHalfHour,
  scaleIngredients,
  sumBakersPercent,
  totalMinutes,
  type PizzaRecipe,
} from "@/lib/pizza-recipes";

function getFallbackRecipe(): PizzaRecipe {
  const recipe = pizzaRecipes[0];
  if (!recipe) {
    throw new Error("No pizza recipes configured");
  }
  return recipe;
}

function formatBakersPercent(value: number): string {
  return `${value}%`;
}

function formatGrams(value: number, decimals: number): string {
  return decimals === 0 ? `${value} g` : `${value.toFixed(decimals)} g`;
}

function dateToParts(date: Date): { day: string; time: string } {
  const pad = (value: number) => String(value).padStart(2, "0");
  return {
    day: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

function combineDateAndTime(day: string, time: string): Date | undefined {
  if (!day) {
    return undefined;
  }
  const bakeDate = new Date(`${day}T${time || "00:00"}`);
  if (Number.isNaN(bakeDate.getTime())) {
    return undefined;
  }
  return bakeDate;
}

function suggestBakeAt(totalPhaseMinutes: number): { day: string; time: string } {
  return dateToParts(roundUpToNextHalfHour(new Date(Date.now() + totalPhaseMinutes * 60_000)));
}

function formatBakeAt(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

const recipeCollection = createListCollection({
  items: pizzaRecipes.map((entry) => ({ label: entry.name, value: entry.id })),
});

const phaseIcons: Record<string, typeof CookingPot> = {
  mix: CookingPot,
  bulk: Clock,
  rest: Hourglass,
  divide: Knife,
  proof: Hourglass,
};

const BAKE_TOOLTIP =
  "Bake as hot as your oven allows — ideally 430–480°C / 800–900°F for 60–90 seconds in a pizza oven, or on a steel/stone at max heat.";

function PhaseTooltip({ content }: { content: string }) {
  return (
    <Tooltip content={content} showArrow>
      <Box as="span" display="inline-flex" cursor="help" verticalAlign="middle">
        <Icon size="sm" color="fg.muted">
          <Info />
        </Icon>
      </Box>
    </Tooltip>
  );
}

export default function PizzaPage() {
  const [recipeIndex, setRecipeIndex] = useState(0);
  const recipe = pizzaRecipes[recipeIndex] ?? getFallbackRecipe();

  const [pizzaCount, setPizzaCount] = useState(2);
  const [bakeDay, setBakeDay] = useState("");
  const [bakeTime, setBakeTime] = useState("18:00");
  const [hasManualBakeTime, setHasManualBakeTime] = useState(false);

  const border = useColorModeValue("neutral.400", "neutralD.400");
  const cardBg = useColorModeValue("white", "neutralD.100");

  const ingredients = useMemo(() => scaleIngredients(recipe, pizzaCount), [recipe, pizzaCount]);
  const totals = useMemo(() => totalMinutes(recipe, {}), [recipe]);
  const totalIngredientGrams = useMemo(
    () => ingredients.reduce((sum, ingredient) => sum + ingredient.grams, 0),
    [ingredients],
  );

  useEffect(() => {
    setHasManualBakeTime(false);
  }, [recipe]);

  useEffect(() => {
    if (!hasManualBakeTime) {
      const suggested = suggestBakeAt(totals.total);
      setBakeDay(suggested.day);
      setBakeTime(suggested.time);
    }
  }, [totals.total, hasManualBakeTime, recipe.id]);

  const bakeDate = combineDateAndTime(bakeDay, bakeTime);

  const schedule = useMemo(() => {
    if (!bakeDate) {
      return [];
    }
    return buildSchedule({
      recipe,
      overrides: {},
      bakeAt: bakeDate,
    });
  }, [bakeDate, recipe]);

  const startIsInPast = schedule.length > 0 && schedule[0]!.start.getTime() < Date.now();

  const datePickerValue = bakeDay ? [parseDate(bakeDay)] : [];

  return (
    <>
      <Hero
        title="Pizza Dough Calculator"
        subtitle="Calculate the ingredients and schedule for baking Neapolitan pizza."
      />
      <VStack gap={12} mt={6} align="stretch">
        <Section>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} w="100%">
            <Select.Root
              collection={recipeCollection}
              value={[recipe.id]}
              onValueChange={(details) => {
                const nextId = details.value[0];
                const index = pizzaRecipes.findIndex((entry) => entry.id === nextId);
                if (index >= 0) {
                  setRecipeIndex(index);
                }
              }}
            >
              <Select.HiddenSelect />
              <Select.Label>Recipe</Select.Label>
              <Select.Control>
                <Select.Trigger bg={cardBg}>
                  <Select.ValueText placeholder="Select recipe" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {recipeCollection.items.map((item) => (
                      <Select.Item item={item} key={item.value}>
                        {item.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            <Field.Root>
              <Field.Label>Number of pizzas</Field.Label>
              <NumberInput.Root
                min={1}
                value={String(pizzaCount)}
                onValueChange={(details) => {
                  if (Number.isFinite(details.valueAsNumber) && details.valueAsNumber >= 1) {
                    setPizzaCount(Math.floor(details.valueAsNumber));
                  }
                }}
                w="100%"
              >
                <NumberInput.Input bg={cardBg} />
                <NumberInput.Control>
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
              </NumberInput.Root>
            </Field.Root>

            <DatePicker.Root
              value={datePickerValue}
              onValueChange={(details) => {
                setHasManualBakeTime(true);
                const next = details.value[0];
                setBakeDay(next ? next.toString() : "");
              }}
              closeOnSelect={false}
            >
              <DatePicker.Label>Bake at</DatePicker.Label>
              <DatePicker.Control>
                <DatePicker.Trigger asChild unstyled>
                  <Button
                    variant="outline"
                    width="full"
                    justifyContent="space-between"
                    fontWeight="normal"
                    bg={cardBg}
                  >
                    {bakeDate ? formatBakeAt(bakeDate) : "Select date and time"}
                    <Calendar size={18} />
                  </Button>
                </DatePicker.Trigger>
              </DatePicker.Control>
              <Portal>
                <DatePicker.Positioner>
                  <DatePicker.Content>
                    <DatePicker.View view="day">
                      <DatePicker.Header />
                      <DatePicker.DayTable />
                      <Field.Root px="3" pb="3">
                        <Field.Label>Time</Field.Label>
                        <Input
                          type="time"
                          value={bakeTime}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setHasManualBakeTime(true);
                            setBakeTime(event.currentTarget.value);
                          }}
                        />
                      </Field.Root>
                    </DatePicker.View>
                    <DatePicker.View view="month">
                      <DatePicker.Header />
                      <DatePicker.MonthTable />
                    </DatePicker.View>
                    <DatePicker.View view="year">
                      <DatePicker.Header />
                      <DatePicker.YearTable />
                    </DatePicker.View>
                  </DatePicker.Content>
                </DatePicker.Positioner>
              </Portal>
            </DatePicker.Root>
          </SimpleGrid>
        </Section>

        <Section>
          <VStack align="stretch" gap={4}>
            <Heading as="h2" size="lg">
              Ingredients
            </Heading>
            <Box
              borderWidth="1px"
              borderColor={border}
              borderRadius="lg"
              bg={cardBg}
              overflow="hidden"
            >
              <Table.Root size="sm">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Ingredient</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Weight</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Baker&apos;s %</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {ingredients.map((ingredient) => (
                    <Table.Row key={ingredient.key}>
                      <Table.Cell>{ingredient.label}</Table.Cell>
                      <Table.Cell fontVariantNumeric="tabular-nums" textAlign="end">
                        {formatGrams(ingredient.grams, ingredient.decimals)}
                      </Table.Cell>
                      <Table.Cell fontVariantNumeric="tabular-nums" textAlign="end">
                        {formatBakersPercent(ingredient.bakersPercent)}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row fontWeight="semibold">
                    <Table.Cell>Total</Table.Cell>
                    <Table.Cell fontVariantNumeric="tabular-nums" textAlign="end">
                      {Math.round(totalIngredientGrams)} g
                    </Table.Cell>
                    <Table.Cell fontVariantNumeric="tabular-nums" textAlign="end">
                      {formatBakersPercent(sumBakersPercent(recipe))}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            </Box>
          </VStack>
        </Section>

        <Section>
          <VStack align="stretch" gap={6}>
            <Heading as="h2" size="lg">
              Schedule
            </Heading>

            {startIsInPast ? (
              <Alert.Root status="warning" borderRadius="md">
                <Alert.Indicator />
                <Alert.Title>
                  Start time is in the past. Try a later bake time, or switch to the Emergency
                  dough.
                </Alert.Title>
              </Alert.Root>
            ) : null}

            {schedule.length > 0 && bakeDate ? (
              <Timeline.Root size="xl" maxW="xl">
                {schedule.map((step) => {
                  const PhaseIcon = phaseIcons[step.id] ?? Clock;
                  return (
                    <Timeline.Item key={step.id}>
                      <Timeline.Connector>
                        <Timeline.Separator />
                        <Timeline.Indicator>
                          <PhaseIcon size={16} />
                        </Timeline.Indicator>
                      </Timeline.Connector>
                      <Timeline.Content>
                        <Timeline.Title>
                          {step.label}
                          {step.tooltip ? <PhaseTooltip content={step.tooltip} /> : null}
                        </Timeline.Title>
                        <Timeline.Description fontVariantNumeric="tabular-nums">
                          {formatScheduleTime(step.start)} · {formatDuration(step.minutes)}
                        </Timeline.Description>
                      </Timeline.Content>
                    </Timeline.Item>
                  );
                })}
                <Timeline.Item>
                  <Timeline.Connector>
                    <Timeline.Separator />
                    <Timeline.Indicator>
                      <Fire size={16} />
                    </Timeline.Indicator>
                  </Timeline.Connector>
                  <Timeline.Content>
                    <Timeline.Title>
                      Bake
                      <PhaseTooltip content={BAKE_TOOLTIP} />
                    </Timeline.Title>
                    <Timeline.Description fontVariantNumeric="tabular-nums">
                      {formatScheduleTime(bakeDate)}
                    </Timeline.Description>
                  </Timeline.Content>
                </Timeline.Item>
              </Timeline.Root>
            ) : null}
          </VStack>
        </Section>
      </VStack>
    </>
  );
}
