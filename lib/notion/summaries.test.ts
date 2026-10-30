import { expect, test } from "vite-plus/test";

import { mapNotionBlogPost, mapNotionGenericPage, type NotionDatabaseItem } from "./summaries";

const title = { type: "title", title: [{ plain_text: "Hello" }] };
const slug = { type: "rich_text", rich_text: [{ plain_text: "hello" }] };
const publishDate = { type: "date", date: { start: "2024-01-02" } };

function blog(properties: NotionDatabaseItem["properties"]): NotionDatabaseItem {
  return { id: "post-1", properties };
}

test("includes a draft that has a slug, title, and publish date", () => {
  const post = mapNotionBlogPost(
    blog({
      Title: title,
      Slug: slug,
      "Publish date": publishDate,
      Status: { type: "status", status: { name: "Draft" } },
    }),
  );

  expect(post).not.toBeNull();
  expect(post?.slug).toBe("hello");
  expect(post?.isPublished).toBe(false);
  expect(post?.readURL).toBe("/blog/hello");
});

test("marks a published post and still returns it", () => {
  const post = mapNotionBlogPost(
    blog({
      Title: title,
      Slug: slug,
      "Publish date": publishDate,
      Status: { type: "status", status: { name: "Published" } },
    }),
  );

  expect(post?.isPublished).toBe(true);
});

test("drops a blog row with no slug or no publish date", () => {
  expect(mapNotionBlogPost(blog({ Title: title, "Publish date": publishDate }))).toBeNull();
  expect(mapNotionBlogPost(blog({ Title: title, Slug: slug }))).toBeNull();
  expect(mapNotionBlogPost(blog({}))).toBeNull();
});

test("includes an unpublished Notion page and records that it is unpublished", () => {
  const page = mapNotionGenericPage({
    id: "page-1",
    properties: {
      Name: { type: "title", title: [{ plain_text: "About" }] },
      Slug: slug,
      Published: { type: "checkbox", checkbox: false },
    },
  });

  expect(page).toEqual({
    id: "page-1",
    title: "About",
    slug: "hello",
    isPublished: false,
    showNavigation: false,
    readURL: "/hello",
  });
});

test("drops a page row with no title", () => {
  expect(
    mapNotionGenericPage({
      id: "page-1",
      properties: { Slug: slug },
    }),
  ).toBeNull();
});
