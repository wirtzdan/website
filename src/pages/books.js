import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import BookList from "../components/booklist";

function BooksPage() {
  return (
    <Layout>
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Books"
      />
      <section class="my-10">
        <h1 class="text-6xl">Books</h1>
        <p class="text-2xl text-gray-700">
          I like reading books with different topics, here are some of the ones
          I read recently.
        </p>
      </section>
      <BookList />
    </Layout>
  );
}

export default BooksPage;
