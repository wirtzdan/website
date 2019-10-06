import React from "react";

import { Layout, SEO, Section } from "../components/common";

function IndexPage() {
  return (
    <Layout>
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />

      <Section>
        <p class="text-gray-600 dark:text-gray-400 text-4xl">Hello! 👋</p>
        <h1 class="text-4xl md:text-6xl leading-tight font-bold dark:text-gray-200">
          I’m Daniel Wirtz. German Product Designer. Founder at{" "}
          <a
            class="text-green-400 hover:underline hover:text-green-500"
            href="https://crisp.studio"
          >
            Crisp Studio
          </a>
          .
        </h1>
      </Section>
    </Layout>
  );
}

export default IndexPage;
