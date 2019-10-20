import React from "react";

import { Layout, SEO, Section } from "../components/common";
import BookList from "../components/bookList";

function ReadingPage() {
  return (
    <Layout>
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Books"
      />
      <Section>
        <h1>What I'm Reading</h1>
        <p>
          I like reading books with different topics, here are some of the ones
          I read recently.
        </p>
      </Section>
      <Section>
        <BookList />
      </Section>
    </Layout>
  );
}

export default ReadingPage;
