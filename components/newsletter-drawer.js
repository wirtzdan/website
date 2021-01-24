import React, { useState } from "react";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  Button,
  VStack,
  FormControl,
  Alert,
  AlertIcon,
  Tooltip,
  Collapse,
  Text,
  FormHelperText,
} from "@chakra-ui/react";
import { Rss } from "heroicons-react";
import { useForm } from "react-hook-form";
import MobileMenuButton from "./mobile-menu-button";
import Link from "next/link";

const NewsletterDrawer = ({ mobile, placement }) => {
  const [isSuccessful, setIsSuccessful] = useState(undefined);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm();

  const onSubmit = async (data, e) => {
    const response = await fetch(
      "https://app.convertkit.com/forms/1925593/subscriptions",
      {
        method: "post",
        body: JSON.stringify({ email_address: data.email_address }, null, 2),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const responseJson = await response.json();

    if (responseJson.status === "success") {
      setIsSuccessful(true);
    } else {
      setIsSuccessful(false);
    }
  };

  const onError = () => {};

  return (
    <Box>
      {placement === "blog" ? (
        <Button
          leftIcon={<Rss size={20} />}
          onClick={onOpen}
          colorScheme="purple"
        >
          Subscribe
        </Button>
      ) : (
        <Tooltip label="Newsletter">
          <MobileMenuButton label="Subscribe" icon={<Rss />} onClick={onOpen} />
        </Tooltip>
      )}
      <Drawer
        isOpen={isOpen}
        size="md"
        placement="bottom"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay>
          <DrawerContent borderTopRadius="6px">
            <DrawerCloseButton />
            <DrawerHeader>Subscribe</DrawerHeader>
            <DrawerBody pb={4}>
              <VStack align="stretch" spacing={4}>
                <Text>
                  Want to stay in loop on new articles and projects? Then drop
                  your email below. Alternatively, you can{" "}
                  <Link href="/rss.xml">subscribe with RSS</Link>.
                </Text>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                  <VStack spacing={4}>
                    <FormControl w="100%">
                      <Input
                        name="email_address"
                        placeholder="you@email.com"
                        type="email"
                        ref={register({ required: true })}
                        isDisabled={isSuccessful}
                        isLoading={isSubmitSuccessful}
                        rounded="lg"
                      />
                      <FormHelperText>Send max. once per month</FormHelperText>
                      {errors.author && (
                        <FormErrorMessage>
                          "E-Mail is required"
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <Button
                      mt={4}
                      colorScheme="purple"
                      type="submit"
                      w="100%"
                      isDisabled={isSuccessful}
                      isLoading={isSubmitting}
                      leftIcon={<Rss size={20} />}
                      rounded="xl"
                    >
                      Subscribe
                    </Button>

                    <Collapse in={isSuccessful} animateOpacity>
                      <Alert borderRadius="md" status="success">
                        <AlertIcon />
                        Success! Now check your email to confirm your
                        subscription.
                      </Alert>
                    </Collapse>
                  </VStack>
                </form>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default NewsletterDrawer;
