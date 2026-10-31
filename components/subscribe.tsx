"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { Alert, Button, Icon, Input, Stack, chakra, Field } from "@chakra-ui/react";
import { RiCheckboxCircleLine, RiErrorWarningLine, RiRssLine } from "@remixicon/react";
import { useForm } from "react-hook-form";

import { HoneypotField } from "@/components/honeypot-field";
import type { AddSubscriberRequestBody, AddSubscriberResponseBody } from "@/types/api";

interface SubscribeProps {
  direction?: "row" | "column" | { base: "column"; md: "row" };
  display?: Record<string, string> | string;
  pt?: number;
  w?: string;
}

interface SubscribeFormValues {
  email_address: string;
  company_website?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONNECTION_ERROR = "Couldn't subscribe. Check your connection and try again.";

const Subscribe = ({ direction = "row", ...props }: SubscribeProps) => {
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  const errorId = useId();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SubscribeFormValues>({
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (isSuccessful) {
      successRef.current?.focus();
    }
  }, [isSuccessful]);

  const onSubmit = async (data: SubscribeFormValues) => {
    setErrorMessage("");
    const payload: AddSubscriberRequestBody = {
      email: data.email_address,
      referrer_url: window.location.href,
      company_website: data.company_website,
    };

    try {
      const response = await fetch("/api/addSubscriber", {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      let body: AddSubscriberResponseBody | null = null;
      try {
        body = (await response.json()) as AddSubscriberResponseBody;
      } catch {
        body = null;
      }

      if (!response.ok || body?.error) {
        setErrorMessage(body?.error || CONNECTION_ERROR);
        return;
      }

      setIsSuccessful(true);
    } catch {
      setErrorMessage(CONNECTION_ERROR);
    }
  };

  const emailField = register("email_address", {
    required: "Enter your email address",
    pattern: {
      value: EMAIL_PATTERN,
      message: "Enter an email address like you@email.com",
    },
  });

  return (
    <chakra.form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      {...props}
      w="100%"
      position="relative"
    >
      <HoneypotField register={register} />
      <Stack direction="column" w="100%" gap={2}>
        {isSuccessful ? (
          <Alert.Root
            ref={successRef}
            tabIndex={-1}
            role="status"
            borderRadius="md"
            status="success"
            fontSize="sm"
            w="100%"
          >
            <Alert.Indicator>
              <RiCheckboxCircleLine />
            </Alert.Indicator>
            Success! Now check your email to confirm your subscription.
          </Alert.Root>
        ) : (
          <>
            <Stack gap={2} direction={direction} align="start" justify="start" w="full">
              <Field.Root flex="1" w="full" invalid={Boolean(errors.email_address)} required>
                <Field.Label srOnly>Email address</Field.Label>
                <Input
                  {...emailField}
                  onChange={(event) => {
                    setErrorMessage("");
                    void emailField.onChange(event);
                  }}
                  placeholder="you@email.com"
                  type="email"
                  autoComplete="email"
                  enterKeyHint="send"
                  inputMode="email"
                  spellCheck={false}
                  disabled={isSubmitting}
                  {...(errorMessage ? { "aria-describedby": errorId } : {})}
                  rounded="lg"
                  w="100%"
                  minW={{ base: "48", md: "64" }}
                  fontSize="16px"
                  bg={{ _light: "white", _dark: "neutralD.100" }}
                />
                {errors.email_address?.message ? (
                  <Field.ErrorText>{errors.email_address.message}</Field.ErrorText>
                ) : null}
              </Field.Root>
              <Button
                colorPalette="blue"
                type="submit"
                minW="36"
                disabled={isSubmitting}
                loading={isSubmitting}
                loadingText="Subscribing…"
                aria-busy={isSubmitting}
                rounded="lg"
              >
                <Icon asChild>
                  <RiRssLine />
                </Icon>
                Subscribe
              </Button>
            </Stack>
            {errorMessage ? (
              <Alert.Root
                id={errorId}
                role="alert"
                borderRadius="md"
                status="warning"
                fontSize="sm"
                w="100%"
              >
                <Alert.Indicator>
                  <RiErrorWarningLine />
                </Alert.Indicator>
                {errorMessage}
              </Alert.Root>
            ) : null}
          </>
        )}
      </Stack>
    </chakra.form>
  );
};

export default Subscribe;
