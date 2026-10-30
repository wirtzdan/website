"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const LapsePanel: ComponentType | null =
  process.env.NODE_ENV === "production"
    ? null
    : dynamic(() => import("@aiforui/lapse").then((mod) => mod.Lapse), {
        ssr: false,
      });

export default function LapseDevtools() {
  if (!LapsePanel) return null;
  return <LapsePanel />;
}
