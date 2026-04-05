"use client";

interface BlogArticleJsonLdProps {
  title: string;
  description?: string;
  publishDate: string;
  url: string;
  socialImage?: string | null;
}

export default function BlogArticleJsonLd({
  title,
  description,
  publishDate,
  url,
  socialImage,
}: BlogArticleJsonLdProps) {
  const date = new Date(publishDate).toISOString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: title,
    image: socialImage ? [socialImage] : [],
    datePublished: date,
    dateModified: date,
    author: { "@type": "Person", name: "Daniel Wirtz" },
    publisher: {
      "@type": "Organization",
      name: "Daniel Wirtz",
      logo: {
        "@type": "ImageObject",
        url: "https://danielwirtz.com/static/favicons/android-chrome-192x192.png",
      },
    },
    description: description ?? "",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
