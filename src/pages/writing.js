import React from "react";

import { graphql, Link } from "gatsby";
import { Layout, SEO, Section } from "../components/common";
import BlogPostCard from "../components/BlogPostCard";

function WritingPage({ data }) {
  const posts = data.allMarkdownRemark.edges;
  return (
    <Layout>
      <SEO keywords={[]} title="Writing" />
      <Section>
        <h1>What I'm Writing</h1>
        <p className="measure">
          My personal blog. A mixed bag with articles about Design, Development
          and my own thoughts.
        </p>
      </Section>

      <Section extend="mt-0 ">
        <div className="flex flex-wrap -mx-2">
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
        </div>
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
