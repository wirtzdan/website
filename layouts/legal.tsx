import type { ReactNode } from "react";

import Section from "@/components/section";

interface LegalLayoutProps {
  children: ReactNode;
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <Section>
      <div>{children}</div>
    </Section>
  );
}
