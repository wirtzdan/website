import { NextSeo, ArticleJsonLd } from "next-seo";

const BlogSeo = ({ title, description, publishDate, url, socialImage }) => {
  const date = new Date(publishDate).toISOString();
  const images = [];

  if (socialImage) {
    images.push({
      url: socialImage,
      width: 1200,
      height: 630,
      alt: `${title} social image`,
    });
  }

  return (
    <>
      <NextSeo
        title={`${title} – Daniel Wirtz`}
        description={description}
        canonical={url}
        openGraph={{
          type: "article",
          article: {
            publishedTime: date,
          },
          url,
          title,
          description: description,
          images: images,
        }}
      />
      <ArticleJsonLd
        authorName="Daniel Wirtz"
        dateModified={date}
        datePublished={date}
        description={description}
        images={[socialImage].filter(Boolean)}
        publisherLogo="/static/favicons/android-chrome-192x192.png"
        publisherName="Daniel Wirtz"
        title={title}
        url={url}
      />
    </>
  );
};

export default BlogSeo;
