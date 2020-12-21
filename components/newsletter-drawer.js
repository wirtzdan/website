import React from "react";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  useDisclosure,
  Input,
  Button,
  VStack,
  FormControl,
  Alert,
  AlertIcon,
  FormLabel,
  FormHelperText,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import { Mail, MailOutline } from "heroicons-react";
import { useForm } from "react-hook-form";

const NewsletterDrawer = ({ mobile }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const {
    register,
    handleSubmit,
    watch,
    errors,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm();
  const onSubmit = async (data) => {
    await sendSuggestion(data);
  };

  return (
    <Box>
      <Tooltip label="Newsletter">
        <IconButton
          isRound
          onClick={onOpen}
          icon={<MailOutline />}
          variant={mobile ? "ghost" : undefined}
        />
      </Tooltip>
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={4}>
                  <FormControl w="100%">
                    <FormLabel>First Name</FormLabel>
                    <Input
                      name="First Name"
                      placeholder="Name"
                      ref={register({ required: true })}
                      isDisabled={isSubmitSuccessful}
                    />
                    {errors.title && (
                      <FormErrorMessage>
                        "First name is required"
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl w="100%">
                    <FormLabel>E-Mail</FormLabel>
                    <Input
                      name="e-mail"
                      placeholder="you@email.com"
                      type="email"
                      ref={register({ required: true })}
                      isDisabled={isSubmitSuccessful}
                    />
                    {errors.author && (
                      <FormErrorMessage>"E-Mail is required"</FormErrorMessage>
                    )}
                  </FormControl>

                  {isSubmitSuccessful ? (
                    <Alert status="success" rounded="md">
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
                      isDisabled
                    >
                      Subscribe
                    </Button>
                  )}
                </VStack>
              </form>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default NewsletterDrawer;
