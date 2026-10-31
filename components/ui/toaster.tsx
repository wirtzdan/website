"use client";

import {
  Icon,
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react";
import { RiCheckboxCircleLine, RiCloseLine, RiErrorWarningLine } from "@remixicon/react";

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root width={{ md: "sm" }}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : toast.type === "success" ? (
              <Icon boxSize="5" asChild>
                <RiCheckboxCircleLine />
              </Icon>
            ) : toast.type === "error" || toast.type === "warning" ? (
              <Icon boxSize="5" asChild>
                <RiErrorWarningLine />
              </Icon>
            ) : null}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
            </Stack>
            {toast.action && <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>}
            {toast.closable && (
              <Toast.CloseTrigger>
                <RiCloseLine />
              </Toast.CloseTrigger>
            )}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
