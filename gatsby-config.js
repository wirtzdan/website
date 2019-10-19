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
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Daniel Wirtz`,
        short_name: `Daniel Wirtz`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#48BB78`,
        display: `minimal-ui`,
        icon: `${__dirname}/content/assets/favicon.png`
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
