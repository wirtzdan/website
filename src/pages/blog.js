import React from "react";

import { graphql } from "gatsby";
import { Layout, SEO, Section } from "../components/common";
import BlogPostCard from "../components/BlogPostCard";

function Blog({ data }) {
  const posts = data.allMarkdownRemark.edges;
  return (
    <Layout>
      <SEO keywords={[]} title="Writing" />
      <Section>
        <h1>Blog</h1>
        <p className="measure">
          My personal blog. A mixed bag with articles about Tech, Design and
          some personal thoughts.
        </p>
      </Section>

      <Section extend="mt-0 ">
        <div className="flex flex-wrap -mx-2">
          {posts.map(({ node }) => {
            const title = node.frontmatter.title;
            const timeToRead = node.timeToRead;
            const subtitle = node.frontmatter.subtitle;
            const slug = node.fields.slug;
            const date = node.frontmatter.date;

            return (
              <BlogPostCard
                title={title}
                subtitle={subtitle}
                timeToRead={timeToRead}
                slug={slug}
                date={date}
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

export default Blog;
