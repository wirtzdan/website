"use client";

import { useCallback, useState } from "react";

/** Minimal clipboard helper matching the old Chakra v2 `useClipboard` shape. */
export function useClipboard(value: string) {
  const [hasCopied, setHasCopied] = useState(false);
  const onCopy = useCallback(() => {
    void navigator.clipboard.writeText(value).then(() => {
      setHasCopied(true);
      window.setTimeout(() => setHasCopied(false), 1500);
    });
  }, [value]);
  return { hasCopied, onCopy };
}
