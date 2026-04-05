import Airtable, { type FieldSet } from "airtable";

import type { AirtableRecord, BookFields, NewsletterFields, ToolFields } from "@/types/content";

type BlogFields = FieldSet & {
  status?: string;
  slug?: string;
};

type NewsletterFieldSet = FieldSet & NewsletterFields;

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = airtable.base(process.env.AIRTABLE_BASE_ID as string);

const getMinifiedRecords = <TFields extends FieldSet>(
  records: readonly Airtable.Record<TFields>[],
): AirtableRecord<TFields>[] => {
  return records.map((record) => minifyRecord(record));
};

const minifyRecord = <TFields extends FieldSet>(
  record: Airtable.Record<TFields>,
): AirtableRecord<TFields> => {
  return {
    id: record.id,
    fields: record.fields,
  };
};

async function getTable<TFields extends FieldSet = FieldSet>(table: string) {
  const records = await base<TFields>(table).select({}).all();
  return getMinifiedRecords(records);
}

async function getAllPosts() {
  const records = await base("Blog")
    .select({
      filterByFormula: `OR({status} = "Published", {status} = "Draft")`,
    })
    .all();

  return getMinifiedRecords(records);
}

async function getAllNewsletters() {
  const records = await base<NewsletterFieldSet>("Newsletter")
    .select({
      filterByFormula: `{status} = "Published"`,
    })
    .all();

  return getMinifiedRecords(records);
}

async function getAllNewsletterPaths() {
  const newsletters = await getAllNewsletters();

  return newsletters.map((newsletter) => {
    return {
      params: {
        id: newsletter.id,
        slug: newsletter.fields.Slug,
      },
    };
  });
}

async function getAllPostsPaths() {
  const posts = await getAllPosts();

  return posts.map((post) => {
    return {
      params: {
        id: post.id,
        slug: post.fields.slug,
      },
    };
  });
}

async function getNewsletterData(slug: string) {
  const records = await base<NewsletterFieldSet>("Newsletter")
    .select({
      maxRecords: 1,
      filterByFormula: `{Slug} = "${slug}"`,
    })
    .all();

  const newsletter = getMinifiedRecords(records);

  return {
    newsletter,
  };
}

async function getPostData(slug: string) {
  const records = await base<BlogFields>("Blog")
    .select({
      maxRecords: 1,
      filterByFormula: `{slug} = "${slug}"`,
    })
    .all();

  const post = getMinifiedRecords(records);

  return {
    post,
  };
}

export {
  getTable,
  getAllPosts,
  getPostData,
  getAllPostsPaths,
  getNewsletterData,
  getAllNewsletterPaths,
  getAllNewsletters,
};

export type { AirtableRecord, BookFields, NewsletterFields, ToolFields };
