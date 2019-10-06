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
        <h1 class="text-4xl md:text-6xl leading-tight ">What I'm Reading</h1>
        <p class="text-2xl text-gray-700 dark:text-gray-300">
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
