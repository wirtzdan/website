import React from "react";

import { Layout, SEO, Section, Button } from "../components/common";
import { Twitter } from "react-feather";

function IndexPage() {
  return (
    <Layout>
      <SEO keywords={[]} title="Home" />

      <Section>
        <p className="text-4xl text-neutral-500 dark:text-neutral-300">
          Hey, I'm Daniel 👋
        </p>
        <h2 className="mb-8 text-4xl font-bold leading-tight border-b-0 md:text-6xl dark:text-neutral-10">
          Designer and Co-Founder of{" "}
          <a className="link-underline no-select " href="https://crisp.studio/">
            Crisp Studio
          </a>
          . I grew up in Germany and now live in Utrecht, the Netherlands.
        </h2>
        <Button
          text="Say hello"
          icon={<Twitter />}
          to="https://twitter.com/wirtzdan"
          extend="bg-primary-500 hover:bg-primary-600"
        />
      </Section>
    </Layout>
  );
}

export default IndexPage;
