import React from "react";

import { graphql, Link } from "gatsby";
import { Layout, SEO, Section } from "../components/common";
import BlogPostCard from "../components/BlogPostCard";

function WritingPage({ data }) {
  const posts = data.allMarkdownRemark.edges;
  return (
    <Layout>
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Books"
      />
      <Section>
        <h1>What I'm writing</h1>
        <p>
          Faucibus arcu primis tristique litora massa commodo pulvinar nisl, est
          consectetur non elit iaculis id risus integer, lectus nec rhoncus
          imperdiet pretium quam dapibus.
        </p>
      </Section>

      <Section className="flex flex-wrap mb-4">
        {posts.map(({ node }) => {
          const title = node.frontmatter.title;
          const timeToRead = node.timeToRead;
          const subtitle = node.frontmatter.subtitle;
          const slug = node.fields.slug;

          return (
            <BlogPostCard
              title={title}
              subtitle={subtitle}
              timeToRead={timeToRead}
              slug={slug}
            />
          );
        })}
      </Section>
    </Layout>
  );
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            subtitle
          }
          timeToRead
        }
      }
    }
  }
`;

export default WritingPage;
