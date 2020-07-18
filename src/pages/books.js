import React from "react";

import { Layout, SEO, Section } from "../components/common";
import BookList from "../components/bookList";

function ReadingPage() {
  return (
    <Layout>
      <SEO keywords={[]} title="Books" />
      <Section>
        <h1>Books</h1>
        <p className="text-2xl measure">
          I always have a book close to me. Here is a list of some that I read
          recently. Head over to{" "}
          <a href="https://www.goodreads.com/user/show/53134379-daniel-wirtz">
            Goodreads
          </a>{" "}
          for the full picture.
        </p>
      </Section>
      <Section extend="mt-0">
        <BookList />
      </Section>
    </Layout>
  );
}

export default ReadingPage;
