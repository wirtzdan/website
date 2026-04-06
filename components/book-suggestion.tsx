"use client";

import React from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";

import type { SuggestionPayload } from "@/types/api";

const BookSuggestion = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      <Button onClick={onOpen} colorScheme="blue">
        Suggest me a book
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Book Suggestion</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={2}>
                <FormControl w="100%" isInvalid={Boolean(errors.title)}>
                  <FormLabel>Title</FormLabel>
                  <Input
                    {...register("title", { required: "Title is required" })}
                    placeholder="Title"
                    isDisabled={isSubmitSuccessful}
                    rounded="lg"
                  />
                  {errors.title ? (
                    <FormErrorMessage>{errors.title.message}</FormErrorMessage>
                  ) : null}
                </FormControl>
                <FormControl w="100%" isInvalid={Boolean(errors.author)}>
                  <FormLabel>Author</FormLabel>
                  <Input
                    {...register("author", { required: "Author is required" })}
                    placeholder="Author"
                    isDisabled={isSubmitSuccessful}
                    rounded="lg"
                  />
                  {errors.author ? (
                    <FormErrorMessage>{errors.author.message}</FormErrorMessage>
                  ) : null}
                </FormControl>
                <FormControl w="100%">
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    {...register("message")}
                    placeholder="Write a message..."
                    isDisabled={isSubmitSuccessful}
                    rounded="lg"
                  />
                </FormControl>
                {isSubmitSuccessful ? (
                  <Alert status="success" rounded="lg">
                    <AlertIcon />
                    Thanks for the suggestion!
                  </Alert>
                ) : (
                  <Button
                    mt={4}
                    colorScheme="blue"
                    type="submit"
                    w="100%"
                    isLoading={isSubmitting}
                    leftIcon={<EnvelopeIcon width={18} height={18} />}
                  >
                    Send suggestion
                  </Button>
                )}
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BookSuggestion;
