import React from "react";
import Section from "@/components/section";
import MDXCompProvider from "@/components/mdx-provider";

export default function LegalLayout({ children }) {
  return (
    <MDXCompProvider>
      <Section>
        <div>{children}</div>
      </Section>
    </MDXCompProvider>
  );
}
