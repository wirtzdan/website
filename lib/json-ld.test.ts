import { expect, test } from "vite-plus/test";

import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  personJsonLd,
  profilePageJsonLd,
  serializeJsonLd,
  websiteJsonLd,
} from "@/lib/json-ld";

const post = {
  title: "Gmail URL paste",
  slug: "gmail-url-paste",
  description: "A trick.",
  publishDate: "2024-03-01",
  modifiedDate: "2025-06-02T10:00:00.000Z",
  socialImage: null,
};

test("blog posts are BlogPosting with a non-empty image and real dateModified", () => {
  const data = blogPostingJsonLd(post);
  expect(data).toMatchObject({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Gmail URL paste",
    description: "A trick.",
    url: "https://danielwirtz.com/blog/gmail-url-paste",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://danielwirtz.com/blog/gmail-url-paste" },
    image: ["https://danielwirtz.com/og/blog/gmail-url-paste"],
    datePublished: "2024-03-01T00:00:00.000Z",
    dateModified: "2025-06-02T10:00:00.000Z",
  });
});

test("blog posts prefer the Notion social image", () => {
  const data = blogPostingJsonLd({ ...post, socialImage: "https://file.notion.so/s.png" });
  expect(data.image).toEqual(["https://file.notion.so/s.png"]);
});

test("dateModified falls back to the publish date", () => {
  const data = blogPostingJsonLd({ ...post, modifiedDate: undefined });
  expect(data.dateModified).toBe(data.datePublished);
});

test("author and publisher are the same Person with profile links", () => {
  const data = blogPostingJsonLd(post);
  expect(data.author).toBe(data.publisher);
  expect(data.author).toMatchObject({
    "@type": "Person",
    name: "Daniel Wirtz",
    url: "https://danielwirtz.com/about",
  });
  expect((data.author as { sameAs: string[] }).sameAs).toContain("https://x.com/wirtzdan");
});

test("breadcrumbs number their items and use absolute URLs", () => {
  expect(
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]),
  ).toEqual({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://danielwirtz.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://danielwirtz.com/blog" },
    ],
  });
});

test("home and about describe the site and the person", () => {
  expect(websiteJsonLd()).toMatchObject({
    "@type": "WebSite",
    name: "Daniel Wirtz",
    url: "https://danielwirtz.com",
  });
  expect(personJsonLd()).toMatchObject({ "@type": "Person", name: "Daniel Wirtz" });
  expect(profilePageJsonLd()).toMatchObject({
    "@type": "ProfilePage",
    mainEntity: { "@type": "Person" },
  });
});

test("serialized JSON-LD can't close its script tag", () => {
  const json = serializeJsonLd(blogPostingJsonLd({ ...post, title: "</script><b>x" }));
  expect(json).not.toContain("<");
  expect(JSON.parse(json).headline).toBe("</script><b>x");
});
