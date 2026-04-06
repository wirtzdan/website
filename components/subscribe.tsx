"use client";
import React, { useState } from "react";
import { Alert, Button, Collapsible, Icon, Input, Stack, chakra, Field } from "@chakra-ui/react";
import { RssIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";

import type { AddSubscriberRequestBody, AddSubscriberResponseBody } from "@/types/api";

interface SubscribeProps {
  direction?: "row" | "column" | { base: "column"; md: "row" };
  display?: Record<string, string> | string;
  pt?: number;
  w?: string;
}

interface SubscribeFormValues {
  email_address: string;
}

const Subscribe = ({ direction = "row", ...props }: SubscribeProps) => {
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SubscribeFormValues>({
    mode: "onChange",
  });

  const onSubmit = async (data: SubscribeFormValues) => {
    const payload: AddSubscriberRequestBody = {
      email: data.email_address,
      referrer_url: window.location.href,
    };

    const response = await fetch("/api/addSubscriber", {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { error } = (await response.json()) as AddSubscriberResponseBody;

    if (error) {
      setErrorMessage(error);
      return;
    }

    setIsSuccessful(true);
    setErrorMessage("");
  };

  return (
    <chakra.form onSubmit={handleSubmit(onSubmit)} {...props} w="100%">
      <Stack direction="column" w="100%">
        {isSuccessful ? (
          <Collapsible.Root open={isSuccessful}>
            <Collapsible.Content>
              <Alert.Root borderRadius="md" status="success" fontSize="sm" w="100%">
                <Alert.Indicator />
                Success! Now check your email to confirm your subscription.
              </Alert.Root>
            </Collapsible.Content>
          </Collapsible.Root>
        ) : (
          <>
            <Stack gap={2} direction={direction} justify="start" w="full">
              <Field.Root w="auto" invalid={Boolean(errors.email_address)}>
                <Input
                  {...register("email_address", { required: "E-Mail is required" })}
                  placeholder="you@email.com"
                  type="email"
                  disabled={isSuccessful}
                  rounded="lg"
                  w="100%"
                  minW={{ base: "48", md: "64" }}
                />
                {errors.email_address ? (
                  <Field.ErrorText>{errors.email_address.message}</Field.ErrorText>
                ) : null}
              </Field.Root>
              <Button
                colorPalette="blue"
                type="submit"
                minW={10}
                disabled={isSuccessful}
                loading={isSubmitting}
                rounded="lg"
              >
                <Icon asChild>
                  <RssIcon />
                </Icon>
                Subscribe
              </Button>
            </Stack>
            <Collapsible.Root open={Boolean(errorMessage)}>
              <Collapsible.Content>
                <Alert.Root borderRadius="md" status="warning" fontSize="sm" w="100%">
                  <Alert.Indicator />
                  {errorMessage}
                </Alert.Root>
              </Collapsible.Content>
            </Collapsible.Root>
          </>
        )}
      </Stack>
    </chakra.form>
  );
};

export default Subscribe;
