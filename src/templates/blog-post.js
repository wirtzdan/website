import React from "react";
import { Link, graphql } from "gatsby";
import "../css/prism-duotone.css";

import { Layout, Section, Newsletter, Divider } from "../components/common";
import SEO from "../components/common/seo";

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = this.props.data.site.siteMetadata.title;
    const { previous, next } = this.props.pageContext;

    return (
      <Layout>
        <SEO title={post.frontmatter.title} description={post.excerpt} />
        <Section>
          <article className="mb-10">
            <header>
              <h1 className="text-5xl">{post.frontmatter.title}</h1>
            </header>
            <section dangerouslySetInnerHTML={{ __html: post.html }} />
          </article>

          <nav>
            <ul className="flex justify-between">
              <li>
                {previous && (
                  <Link to={previous.fields.slug} rel="prev">
                    ← {previous.frontmatter.title}
                  </Link>
                )}
              </li>
              <li>
                {next && (
                  <Link to={next.fields.slug} rel="next">
                    {next.frontmatter.title} →
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </Section>
        <Divider />
        <Newsletter />
      </Layout>
    );
  }
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        subtitle
      }
    }
  }
`;
