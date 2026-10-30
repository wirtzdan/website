"use client";

import { uiCopy } from "@/lib/ui-copy";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1.5,
          margin: "4rem auto",
          maxWidth: "65ch",
          padding: "0 1.5rem",
        }}
      >
        <h1>{uiCopy.error.title}</h1>
        <p>{uiCopy.error.description}</p>
        <button type="button" onClick={() => reset()}>
          {uiCopy.error.retry}
        </button>
        <p>
          <a href="/">{uiCopy.error.home}</a>
        </p>
      </body>
    </html>
  );
}
