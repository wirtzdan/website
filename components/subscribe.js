import React, { useState } from "react";
import {
  Input,
  Button,
  Stack,
  FormControl,
  Alert,
  AlertIcon,
  Collapse,
  FormHelperText,
  chakra,
} from "@chakra-ui/react";
import { Rss } from "heroicons-react";
import { useForm } from "react-hook-form";

const Subscribe = ({ direction, ...props }) => {
  const [isSuccessful, setIsSuccessful] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting, isSubmitSuccessful, isValid },
  } = useForm({
    mode: "onChange",
  });

  console.log(
    "process.env.BUTTONDOWN_API_KEY →",
    process.env.BUTTONDOWN_API_KEY
  );

  const onSubmit = async (data, e) => {
    const response = await fetch(
      "https://api.buttondown.email/v1/subscribers",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email_address,
        }),
      }
    );

    const status = await response.status;

    if (status === 201) {
      setIsSuccessful(true);
      setErrorMessage("");
    } else {
      setIsSuccessful(false);
      const responseJson = await response.json();
      setErrorMessage(responseJson[0]);
    }
  };

  const onError = () => {};

  return (
    <chakra.form onSubmit={handleSubmit(onSubmit, onError)} w="100%" {...props}>
      <Stack direction="column" w="100%">
        {!isSuccessful ? (
          <>
            <Stack spacing={2} direction={direction} justify="start">
              <FormControl w="unset">
                <Input
                  name="email_address"
                  placeholder="you@email.com"
                  type="email"
                  ref={register({ required: true })}
                  isDisabled={isSuccessful}
                  isLoading={isSubmitSuccessful}
                  rounded="lg"
                  w="100%"
                  minW={{ base: "48", md: "64" }}
                />
                {/* <FormHelperText>Send max. once per month</FormHelperText> */}
                {errors.author && (
                  <FormErrorMessage>"E-Mail is required"</FormErrorMessage>
                )}
              </FormControl>
              <Button
                mt={4}
                colorScheme="blue"
                type="submit"
                w="100%"
                minW={10}
                isDisabled={isSuccessful}
                // isDisabled={!isValid}
                isLoading={isSubmitting}
                leftIcon={<Rss size={20} />}
                rounded="lg"
                // size={{ base: "xs", md: "sm" }}
              >
                Subscribe
              </Button>
            </Stack>
            <Collapse in={errorMessage} animateOpacity w="100%">
              <Alert borderRadius="md" status="warning" fontSize="sm">
                <AlertIcon />
                {errorMessage}
              </Alert>
            </Collapse>
          </>
        ) : (
          <>
            <Collapse in={isSuccessful} animateOpacity w="100%">
              <Alert borderRadius="md" status="success" fontSize="sm">
                <AlertIcon />
                Success! Now check your email to confirm your subscription.
              </Alert>
            </Collapse>
          </>
        )}
      </Stack>
    </chakra.form>
  );
};

export default Subscribe;
