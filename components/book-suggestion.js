import React from "react";
import {
  Button,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Box,
  Alert,
  AlertIcon,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Mail } from "heroicons-react";
// import { sendSuggestion } from "@/lib/airtable";

const BookSuggestion = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    watch,
    errors,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm();
  const onSubmit = async (data) => {
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
                <FormControl w="100%">
                  <FormLabel>Title</FormLabel>
                  <Input
                    name="title"
                    placeholder="Title"
                    ref={register({ required: true })}
                    isDisabled={isSubmitSuccessful}
                    rounded="lg"
                  />
                  {errors.title && (
                    <FormErrorMessage>"Title is required"</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl w="100%">
                  <FormLabel>Author</FormLabel>
                  <Input
                    name="author"
                    placeholder="Author"
                    ref={register({ required: true })}
                    isDisabled={isSubmitSuccessful}
                    rounded="lg"
                  />
                  {errors.author && (
                    <FormErrorMessage>"Author is required"</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl w="100%">
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    name="message"
                    placeholder="Write a message..."
                    ref={register}
                    isDisabled={isSubmitSuccessful}
                    rounded="lg"
                  />
                </FormControl>
                {isSubmitSuccessful ? (
                  <Alert status="success" rounded="xl">
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
                    leftIcon={<Mail size={18} />}
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
