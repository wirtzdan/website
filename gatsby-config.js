module.exports = {
  siteMetadata: {
    title: `Daniel Wirtz`,
    description: `Website`,
    author: `@wirtzdan`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Daniel Wirtz`,
        short_name: `Daniel Wirtz`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#15B897`,
        display: `minimal-ui`,
        icon: `src/images/dw-favicon.png`
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
