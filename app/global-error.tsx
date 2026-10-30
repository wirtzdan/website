"use client";

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
        <h1>This page didn't load</h1>
        <p>I hit a snag while putting this page together.</p>
        <button type="button" onClick={() => reset()}>
          Try again
        </button>
        <p>
          <a href="/">Return home</a>
        </p>
      </body>
    </html>
  );
}
