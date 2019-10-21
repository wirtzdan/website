import React from "react";

import { Layout, SEO, Section, Button } from "../components/common";
import { Twitter } from "react-feather";

function IndexPage() {
  return (
    <Layout>
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />

      <Section>
        <p className="text-neutral-500 dark:text-neutral-300 text-4xl">
          Hello! 👋
        </p>
        <h2 className="text-4xl md:text-6xl leading-tight font-bold dark:text-neutral-10 mb-8">
          I’m Daniel Wirtz. German Product Designer. Founder at{" "}
          <a className="link-underline" href="https://crisp.studio">
            Crisp Studio
          </a>
          .
        </h2>
        <Button
          text="Follow me"
          icon={<Twitter />}
          to="https://twitter.com/wirtzdan"
        />
      </Section>
    </Layout>
  );
}

export default IndexPage;
