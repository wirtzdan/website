import { blogPostImage } from "@/lib/blog-metadata";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site-metadata";
import { SITE_URL, absoluteUrl } from "@/lib/site-url";

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

// The profiles linked from the footer and the about page.
const SAME_AS = [
  "https://x.com/wirtzdan",
  "https://www.linkedin.com/in/wirtzdan/",
  "https://github.com/wirtzdan",
  "https://www.youtube.com/@wirtzdan",
  "https://bsky.app/profile/danielwirtz.com",
];

export const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE_NAME,
  url: absoluteUrl("/about"),
  image: absoluteUrl("/avatar-small.jpg"),
  jobTitle: SITE_TAGLINE,
  worksFor: {
    "@type": "Organization",
    name: "Giving What We Can",
    url: "https://www.givingwhatwecan.org/",
  },
  sameAs: SAME_AS,
};

type JsonLd = Record<string, unknown>;

const withContext = (data: JsonLd): JsonLd => ({ "@context": "https://schema.org", ...data });

export function websiteJsonLd(): JsonLd {
  return withContext({
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": PERSON_ID },
  });
}

export function personJsonLd(): JsonLd {
  return withContext(person);
}

export function profilePageJsonLd(): JsonLd {
  return withContext({
    "@type": "ProfilePage",
    url: absoluteUrl("/about"),
    mainEntity: person,
  });
}

export function blogPostingJsonLd(post: {
  title: string;
  slug: string;
  description?: string | null;
  publishDate: string;
  modifiedDate?: string | null;
  socialImage?: string | null;
}): JsonLd {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const datePublished = new Date(post.publishDate).toISOString();
  return withContext({
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.description ? { description: post.description } : {}),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: [blogPostImage(post).url],
    datePublished,
    dateModified: post.modifiedDate ? new Date(post.modifiedDate).toISOString() : datePublished,
    author: person,
    publisher: person,
    isPartOf: { "@type": "Blog", name: `${SITE_NAME}’s blog`, url: absoluteUrl("/blog") },
  });
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return withContext({
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  });
}

/** JSON for a <script> tag: `<` is escaped so content can't close the tag early. */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
