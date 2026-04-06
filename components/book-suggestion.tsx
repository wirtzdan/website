"use client";

import React from "react";
import {
  Alert,
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  useDisclosure,
  Field,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import { RiMailFill } from "@remixicon/react";
import { useForm } from "react-hook-form";

import type { SuggestionPayload } from "@/types/api";

const BookSuggestion = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful, errors },
  } = useForm<SuggestionPayload>();

  const onSubmit = async (data: SuggestionPayload) => {
    await fetch("/api/sendSuggestion", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  return (
    <Box>
      <Button onClick={onOpen} colorPalette="blue">
        Suggest me a book
      </Button>
      <Dialog.Root
        open={open}
        motionPreset="slide-in-bottom"
        onOpenChange={(e) => {
          if (!e.open) {
            onClose();
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>Book Suggestion</Dialog.Header>
              <Dialog.CloseTrigger />
              <Dialog.Body pb={4}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <VStack gap={2}>
                    <Field.Root w="100%" invalid={Boolean(errors.title)}>
                      <Field.Label>Title</Field.Label>
                      <Input
                        {...register("title", { required: "Title is required" })}
                        placeholder="Title"
                        disabled={isSubmitSuccessful}
                        rounded="lg"
                      />
                      {errors.title ? (
                        <Field.ErrorText>{errors.title.message}</Field.ErrorText>
                      ) : null}
                    </Field.Root>
                    <Field.Root w="100%" invalid={Boolean(errors.author)}>
                      <Field.Label>Author</Field.Label>
                      <Input
                        {...register("author", { required: "Author is required" })}
                        placeholder="Author"
                        disabled={isSubmitSuccessful}
                        rounded="lg"
                      />
                      {errors.author ? (
                        <Field.ErrorText>{errors.author.message}</Field.ErrorText>
                      ) : null}
                    </Field.Root>
                    <Field.Root w="100%">
                      <Field.Label>Message</Field.Label>
                      <Textarea
                        {...register("message")}
                        placeholder="Write a message..."
                        disabled={isSubmitSuccessful}
                        rounded="lg"
                      />
                    </Field.Root>
                    {isSubmitSuccessful ? (
                      <Alert.Root status="success" rounded="lg">
                        <Alert.Indicator />
                        Thanks for the suggestion!
                      </Alert.Root>
                    ) : (
                      <Button
                        mt={4}
                        colorPalette="blue"
                        type="submit"
                        w="100%"
                        loading={isSubmitting}
                      >
                        <RiMailFill size={18} />
                        Send suggestion
                      </Button>
                    )}
                  </VStack>
                </form>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
};

export default BookSuggestion;
