import { useCallback, useState } from "react";

export function useClipboard(value: string) {
  const [hasCopied, setHasCopied] = useState(false);

  const onCopy = useCallback(async () => {
    await navigator.clipboard.writeText(value);
    setHasCopied(true);
    window.setTimeout(() => setHasCopied(false), 1500);
  }, [value]);

  return { hasCopied, onCopy };
}
