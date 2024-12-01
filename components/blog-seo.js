import { NextSeo, ArticleJsonLd } from "next-seo";

const BlogSeo = ({ title, description, publishDate, url, socialImage, recordMap }) => {
  const date = new Date(publishDate).toISOString();
  const images = [];

  // Get first text block from the page content if no description is provided
  let finalDescription = description;
  if (!finalDescription && recordMap) {
    const blocks = Object.values(recordMap.block);
    const firstTextBlock = blocks.find(block => 
      block.value?.type === 'text' && 
      block.value?.properties?.title?.[0]?.[0]
    );
    
    if (firstTextBlock) {
      finalDescription = firstTextBlock.value.properties.title[0][0];
      // Limit to ~160 characters for SEO
      if (finalDescription.length > 160) {
        finalDescription = finalDescription.substring(0, 157) + '...';
      }
    }
  }

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
        description={finalDescription}
        canonical={url}
        openGraph={{
          type: "article",
          article: {
            publishedTime: date,
          },
          url,
          title,
          description: finalDescription,
          images: images,
        }}
      />
      <ArticleJsonLd
        authorName="Daniel Wirtz"
        dateModified={date}
        datePublished={date}
        description={finalDescription}
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
