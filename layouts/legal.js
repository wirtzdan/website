import React from "react";
import Section from "@/components/section";

export default function LegalLayout({ children }) {
  return (
    <Section pt={16} pb={{ base: 24, md: 16 }}>
      <div>{children}</div>
    </Section>
  );
}
