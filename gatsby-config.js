module.exports = {
  siteMetadata: {
    title: `Daniel Wirtz`,
    description: `Website`,
    author: `@wirtzdan`
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-relative-images",
            options: {
              name: "assets"
            }
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 700,
              quality: 80
            }
          },
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {
              destinationDir: "static"
            }
          },
          "gatsby-remark-external-links",
          "gatsby-remark-prismjs"
        ]
      }
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Daniel Wirtz`,
        short_name: `Daniel Wirtz`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#2BB0ED`,
        display: `minimal-ui`,
        icon: `${__dirname}/content/assets/favicon.png`
      }
    },
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Red Hat Display`,
            subsets: [`latin`]
          },
          {
            family: `Red Hat Text`,
            subsets: [`latin`],
            variants: ["400", "400i", "700", "900"]
          }
        ]
      }
    },
    {
      resolve: "@jamesdanylik/gatsby-source-goodreads",
      options: {
        key: "a7FiLMTtB3s835j3whTPUQ",
        id: "53134379"
      }
    },
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        tailwind: true,
        whitelist: ["mode-dark"],
        purgeOnly: [`src/css/style.css`]
      }
    },
    `gatsby-plugin-offline`
  ]
};
