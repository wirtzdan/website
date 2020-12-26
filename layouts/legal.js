import React from "react";
import Section from "@/components/section";

export default function LegalLayout({ children }) {
  return (
    <Section py={16}>
      <div>{children}</div>
    </Section>
  );
}
