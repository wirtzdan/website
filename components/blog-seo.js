import { NextSeo, ArticleJsonLd } from "next-seo";

const BlogSeo = ({ title, summary, publishDate, url, image, socialImage }) => {
  const date = new Date(publishDate).toISOString();

  return (
    <>
      <NextSeo
        title={`${title} – Daniel Wirtz`}
        description={summary}
        canonical={url}
        openGraph={{
          type: "article",
          article: {
            publishedTime: date,
          },
          url,
          title,
          description: summary,
          images: [
            {
              url: image,
              width: 2240,
              height: 1260,
              alt: title,
            },
            {
              url: socialImage,
              width: 1200,
              height: 630,
              alt: `${title} social image`,
            },
          ],
        }}
      />
      <ArticleJsonLd
        authorName="Daniel Wirtz"
        dateModified={date}
        datePublished={date}
        description={summary}
        images={[image, socialImage]}
        publisherLogo="/static/favicons/android-chrome-192x192.png"
        publisherName="Daniel Wirtz"
        title={title}
        url={url}
      />
    </>
  );
};

export default BlogSeo;
