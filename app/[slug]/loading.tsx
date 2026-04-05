"use client";

import { Center, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Center minH="50vh">
      <Spinner size="xl" />
    </Center>
  );
}
