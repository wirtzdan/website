import React, { useState } from "react";
import {
  Alert,
  AlertIcon,
  Button,
  Collapse,
  FormControl,
  FormErrorMessage,
  Icon,
  Input,
  Stack,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";
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
          <Collapse in={isSuccessful} animateOpacity>
            <Alert borderRadius="md" status="success" fontSize="sm" w="100%">
              <AlertIcon />
              Success! Now check your email to confirm your subscription.
            </Alert>
          </Collapse>
        ) : (
          <>
            <Stack spacing={2} direction={direction} justify="start" w="full">
              <FormControl w="auto" isInvalid={Boolean(errors.email_address)}>
                <Input
                  {...register("email_address", { required: "E-Mail is required" })}
                  placeholder="you@email.com"
                  type="email"
                  isDisabled={isSuccessful}
                  rounded="lg"
                  w="100%"
                  minW={{ base: "48", md: "64" }}
                  bg={useColorModeValue("white", "neutralD.100")}
                />
                {errors.email_address ? (
                  <FormErrorMessage>{errors.email_address.message}</FormErrorMessage>
                ) : null}
              </FormControl>
              <Button
                colorScheme="blue"
                type="submit"
                minW={10}
                isDisabled={isSuccessful}
                leftIcon={<Icon as={RssIcon} />}
                isLoading={isSubmitting}
                rounded="lg"
              >
                Subscribe
              </Button>
            </Stack>
            <Collapse in={Boolean(errorMessage)} animateOpacity>
              <Alert borderRadius="md" status="warning" fontSize="sm" w="100%">
                <AlertIcon />
                {errorMessage}
              </Alert>
            </Collapse>
          </>
        )}
      </Stack>
    </chakra.form>
  );
};

export default Subscribe;
