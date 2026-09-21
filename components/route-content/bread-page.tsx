"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  Alert,
  Box,
  Button,
  DatePicker,
  DownloadTrigger,
  Field,
  Heading,
  HStack,
  Icon,
  Input,
  NumberInput,
  Portal,
  Select,
  SimpleGrid,
  Table,
  Text,
  Timeline,
  VStack,
  createListCollection,
  parseDate,
} from "@chakra-ui/react";
import {
  Calendar,
  CalendarPlus,
  Clock,
  CookingPot,
  Fire,
  Hourglass,
  Info,
  Knife,
} from "phosphor-react";

import Hero from "@/components/hero";
import Section from "@/components/section";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Tooltip } from "@/components/ui/tooltip";
import { buildBreadCalendar, breadCalendarFileName } from "@/lib/bread-calendar";
import {
  bakeTimeFromSchedule,
  breadRecipes,
  buildSchedule,
  formatDuration,
  formatScheduleTime,
  scaleIngredients,
  sumBakersPercent,
  type BreadRecipe,
} from "@/lib/bread-recipes";

function getFallbackRecipe(): BreadRecipe {
  const recipe = breadRecipes[0];
  if (!recipe) {
    throw new Error("No bread recipes configured");
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
  const startDate = new Date(`${day}T${time || "00:00"}`);
  if (Number.isNaN(startDate.getTime())) {
    return undefined;
  }
  return startDate;
}

function suggestStartAt(recipe: BreadRecipe): { day: string; time: string } {
  const time = recipe.defaultStartTime;
  const now = new Date();
  const today = dateToParts(now).day;
  const todayAtDefault = combineDateAndTime(today, time);
  if (todayAtDefault && todayAtDefault.getTime() > now.getTime()) {
    return { day: today, time };
  }
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return { day: dateToParts(tomorrow).day, time };
}

function formatStartAt(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

const recipeCollection = createListCollection({
  items: breadRecipes.map((entry) => ({ label: entry.name, value: entry.id })),
});

const phaseIcons: Record<string, typeof CookingPot> = {
  autolyse: Hourglass,
  mix: CookingPot,
  bulk: Clock,
  shape: Knife,
  proof: Hourglass,
  preheat: Fire,
};

const BAKE_TOOLTIP =
  "Preheat Dutch ovens to 245°C / 475°F for at least 45 minutes. Bake covered, then uncover to finish browning — about 45 minutes total.";

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

export default function BreadPage() {
  const [recipeIndex, setRecipeIndex] = useState(0);
  const recipe = breadRecipes[recipeIndex] ?? getFallbackRecipe();

  const [loafCount, setLoafCount] = useState(2);
  const [startDay, setStartDay] = useState("");
  const [startTime, setStartTime] = useState(recipe.defaultStartTime);
  const [hasManualStartTime, setHasManualStartTime] = useState(false);

  const border = useColorModeValue("neutral.400", "neutralD.400");
  const cardBg = useColorModeValue("white", "neutralD.100");

  const ingredients = useMemo(() => scaleIngredients(recipe, loafCount), [recipe, loafCount]);
  const totalIngredientGrams = useMemo(
    () => ingredients.reduce((sum, ingredient) => sum + ingredient.grams, 0),
    [ingredients],
  );

  useEffect(() => {
    setHasManualStartTime(false);
  }, [recipe]);

  useEffect(() => {
    if (!hasManualStartTime) {
      const suggested = suggestStartAt(recipe);
      setStartDay(suggested.day);
      setStartTime(suggested.time);
    }
  }, [hasManualStartTime, recipe]);

  const startDate = combineDateAndTime(startDay, startTime);

  const schedule = useMemo(() => {
    if (!startDate) {
      return [];
    }
    return buildSchedule({
      recipe,
      overrides: {},
      startAt: startDate,
    });
  }, [startDate, recipe]);

  const bakeDate = useMemo(() => bakeTimeFromSchedule(schedule), [schedule]);

  const startIsInPast = schedule.length > 0 && schedule[0]!.start.getTime() < Date.now();

  const calendarIcs = useMemo(() => {
    if (!startDate || schedule.length === 0) {
      return "";
    }
    return buildBreadCalendar({
      recipe,
      loafCount,
      ingredients,
      schedule,
      startAt: startDate,
    });
  }, [startDate, ingredients, loafCount, recipe, schedule]);

  const calendarFileName = startDate
    ? breadCalendarFileName(recipe, startDate)
    : "bread-schedule.ics";

  const datePickerValue = startDay ? [parseDate(startDay)] : [];

  return (
    <>
      <Hero
        title="Bread Dough Calculator"
        subtitle="Calculate the ingredients and schedule for baking bread at home."
      />
      <VStack gap={12} mt={6} align="stretch">
        <Section>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} w="100%">
            <Select.Root
              collection={recipeCollection}
              value={[recipe.id]}
              onValueChange={(details) => {
                const nextId = details.value[0];
                const index = breadRecipes.findIndex((entry) => entry.id === nextId);
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
              <Field.Label>Number of loaves</Field.Label>
              <NumberInput.Root
                min={1}
                value={String(loafCount)}
                onValueChange={(details) => {
                  if (Number.isFinite(details.valueAsNumber) && details.valueAsNumber >= 1) {
                    setLoafCount(Math.floor(details.valueAsNumber));
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
                setHasManualStartTime(true);
                const next = details.value[0];
                setStartDay(next ? next.toString() : "");
              }}
              closeOnSelect={false}
            >
              <DatePicker.Label>Start at</DatePicker.Label>
              <DatePicker.Control>
                <DatePicker.Trigger asChild unstyled>
                  <Button
                    variant="outline"
                    width="full"
                    justifyContent="space-between"
                    fontWeight="normal"
                    bg={cardBg}
                  >
                    {startDate ? formatStartAt(startDate) : "Select date and time"}
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
                          value={startTime}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setHasManualStartTime(true);
                            setStartTime(event.currentTarget.value);
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
            <HStack justify="space-between" align="center" gap={4} flexWrap="wrap">
              <Heading as="h2" size="lg">
                Schedule
              </Heading>
              {calendarIcs ? (
                <DownloadTrigger
                  data={calendarIcs}
                  fileName={calendarFileName}
                  mimeType="text/calendar"
                  asChild
                >
                  <Button variant="outline" size="sm" bg={cardBg}>
                    <CalendarPlus size={16} />
                    Add to calendar
                  </Button>
                </DownloadTrigger>
              ) : null}
            </HStack>

            {startIsInPast ? (
              <Alert.Root status="warning" borderRadius="md">
                <Alert.Indicator />
                <Alert.Title>
                  Start time is in the past. Try a later start time
                  {recipe.id === "overnight" ? ", or switch to Saturday White Bread." : "."}
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
