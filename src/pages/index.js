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
        <h1 class="text-6xl">
          I’m Daniel Wirtz. German Product Designer. Founder at{" "}
          <a class="underline text-green-500" href="https://crisp.studio">
            Crisp Studio
          </a>
          .
        </h1>
      </section>
    </Layout>
  );
}

export default IndexPage;
