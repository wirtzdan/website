"use client";

import { useEffect } from "react";

/**
 * Flips true on the frame after the first paint. Entrances read it so a full
 * page load stays still, and client navigations can still move.
 */
export let hasPainted = false;

export default function MarkFirstPaint() {
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      hasPainted = true;
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return null;
}
