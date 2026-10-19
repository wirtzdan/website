"use client";

import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

import { HONEYPOT_FIELD } from "@/lib/honeypot";

export function HoneypotField<T extends FieldValues>({
  register,
}: {
  register: UseFormRegister<T>;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-10000px",
        top: "auto",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      <label>
        Company website
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register(HONEYPOT_FIELD as Path<T>)}
        />
      </label>
    </div>
  );
}
