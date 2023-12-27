import React from "react";
import Section from "@/components/section";

export default function LegalLayout({ children }) {
  return (
    <Section>
      <div>{children}</div>
    </Section>
  );
}
