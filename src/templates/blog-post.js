import React from "react";
import { graphql } from "gatsby";
import "../css/prism-theme.css";
import "../css/markdown.css";

import {
  Layout,
  Section,
  Divider,
  SEO,
  ReadingProgress,
} from "../components/common";

class BlogPostTemplate extends React.Component {
  componentDidMount() {
    const script = document.createElement(`script`);
    script.async = true;
    script.setAttribute(`data-uid`, `17b2acc0f1`);
    script.src = `https://daniels-newsletter.ck.page/17b2acc0f1/index.js`;
    this.div.appendChild(script);
  }

  render() {
    const post = this.props.data.markdownRemark;
    // const siteTitle = this.props.data.site.siteMetadata.title;
    // const { previous, next } = this.props.pageContext;

    const target = React.createRef();

    return (
      <>
        <Layout>
          <SEO
            title={post.frontmatter.title}
            description={post.excerpt}
            slug={post.fields.slug}
          />

          <Section>
            <article className="px-6 bg-white rounded shadow md:px-12 md:py-4 markdown dark:bg-neutral-700" ref={target}>
              <header>
                <h1 className="text-5xl">{post.frontmatter.title}</h1>
              </header>
              <section dangerouslySetInnerHTML={{ __html: post.html }} />
            </article>

            {/* <nav className="my-2 text-base md:text-xl opacity-5">
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
            </nav> */}
            <Divider />
            <div ref={(el) => (this.div = el)}></div>
          </Section>
        </Layout>
        <ReadingProgress target={target} />
      </>
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
      fields {
        slug
      }
    }
  }
`;
