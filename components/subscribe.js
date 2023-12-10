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
  useColorModeValue,
  Box,
  VStack,
  Text,
  Icon,
} from "@chakra-ui/react";
import { RssIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";

const Subscribe = ({ direction, ...props }) => {
  const [isSuccessful, setIsSuccessful] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,

    formState: { isSubmitting, isSubmitSuccessful, isValid, errors },
  } = useForm({
    mode: "onChange",
  });

  function ChakraRssIcon() {
    return <Icon as={RssIcon} />;
  }

  const onSubmit = async (data, e) => {
    const res = await fetch("/api/addSubscriber", {
      body: JSON.stringify({
        email: data.email_address,
        referrer_url: window.location.href,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { error } = await res.json();

    if (error) {
      setErrorMessage(error);
      return;
    } else {
      setIsSuccessful(true);
      setErrorMessage("");
    }
  };

  const onError = () => {};

  return (
    <chakra.form onSubmit={handleSubmit(onSubmit, onError)} {...props} w="100%">
      <Stack direction="column" w="100%">
        {!isSuccessful ? (
          <>
            <Stack spacing={2} direction={direction} justify="start" w="full">
              <FormControl w="unset">
                <Input
                  {...register("email_address", { required: true })}
                  placeholder="you@email.com"
                  type="email"
                  isDisabled={isSuccessful}
                  isLoading={isSubmitSuccessful}
                  rounded="lg"
                  w="100%"
                  minW={{ base: "48", md: "64" }}
                  bg={useColorModeValue("white", "neutralD.100")}
                />
                {/* <FormHelperText>Send max. once per month</FormHelperText> */}
                {errors.author && (
                  <FormErrorMessage>"E-Mail is required"</FormErrorMessage>
                )}
              </FormControl>
              <Button
                colorScheme="blue"
                type="submit"
                minW={10}
                isDisabled={isSuccessful}
                // isDisabled={!isValid}
                leftIcon={<ChakraRssIcon />}
                isLoading={isSubmitting}
                rounded="lg"
                // size={{ base: "md", md: "" }}
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
