import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";

function IndexPage() {
  return (
    <Layout>
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />

      <section>
        <p class="text-gray-600 text-4xl">Hello! 👋</p>
        <h1 class="text-6xl leading-tight">
          I’m Daniel Wirtz. German Product Designer. Founder at{" "}
          <a
            class="text-blue-400 hover:underline hover:text-blue-500"
            href="https://crisp.studio"
          >
            Crisp Studio
          </a>
          .
        </h1>
      </section>
    </Layout>
  );
}

export default IndexPage;
