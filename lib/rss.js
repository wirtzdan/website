const generateRssItem = (post) => `
  <item>
    <guid>https://danielwirtz.com/blog/${post.slug}</guid>
    <title>${post.title}</title>
    <link>https://danielwirtz.com/blog/${post.slug}</link>
    <description>${post.summary}</description>
    <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
  </item>
`;

const generateRss = (posts) => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Blog - Daniel Wirtz</title>
      <link>https://danielwirtz.com/blog</link>
      <description>Designer, developer and maker of things.</description>
      <language>en</language>
      <lastBuildDate>${new Date(
        posts[0].publishedAt
      ).toUTCString()}</lastBuildDate>
      <atom:link href="https://danielwirtz.com/rss.xml" rel="self" type="application/rss+xml"/>
      ${posts.map(generateRssItem).join("")}
    </channel>
  </rss>
`;

export default generateRss;
