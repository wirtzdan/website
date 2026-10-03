/**
 * One-time copy of the Airtable "Books" table into the Notion Books database.
 * Reads AIRTABLE_API_KEY, AIRTABLE_BASE_ID, NOTION_TOKEN, and
 * NOTION_BOOKS_DATABASE_ID from the environment (and .env / .env.local).
 * Re-runs skip rows that already exist with the same Title and Author.
 */
import { config as loadEnv } from "dotenv";
import { Client, isNotionClientError } from "@notionhq/client";
import Airtable from "airtable";

loadEnv();
loadEnv({ path: ".env.local", override: true });

const REQUIRED_ENV = [
  "AIRTABLE_API_KEY",
  "AIRTABLE_BASE_ID",
  "NOTION_TOKEN",
  "NOTION_BOOKS_DATABASE_ID",
];

function missingEnv() {
  return REQUIRED_ENV.filter((key) => !process.env[key]);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function plainText(property) {
  if (!property) {
    return "";
  }
  if (property.type === "title") {
    return (property.title ?? [])
      .map((item) => item.plain_text ?? "")
      .join("")
      .trim();
  }
  if (property.type === "rich_text") {
    return (property.rich_text ?? [])
      .map((item) => item.plain_text ?? "")
      .join("")
      .trim();
  }
  return "";
}

function dateOnly(value) {
  if (typeof value !== "string") {
    return null;
  }
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
  return match ? match[1] : null;
}

function coverUrlFromAirtable(cover) {
  const attachment = Array.isArray(cover) ? cover[0] : null;
  if (!attachment) {
    return null;
  }
  return attachment.thumbnails?.large?.url || attachment.url || null;
}

function bookKey(title, author) {
  return `${title.trim()}\n${author.trim()}`;
}

function richText(content) {
  if (!content) {
    return { rich_text: [] };
  }
  return { rich_text: [{ type: "text", text: { content } }] };
}

function notionProperties(record) {
  const fields = record.fields ?? {};
  const title = String(fields.Title ?? "").trim();
  const author = String(fields.Author ?? "").trim();
  const rating = typeof fields.Rating === "number" ? fields.Rating : null;
  const readOn = dateOnly(fields["Date Read"]);
  const coverUrl = coverUrlFromAirtable(fields.Cover);

  const properties = {
    Title: { title: [{ type: "text", text: { content: title } }] },
    Author: richText(author),
    Rating: { number: rating },
    Favorite: { checkbox: fields.Favorite === true },
    Read: { checkbox: fields.Read === true },
    "Date Read": { date: readOn ? { start: readOn } : null },
  };

  if (coverUrl) {
    properties.Cover = {
      files: [
        {
          name: "cover",
          type: "external",
          external: { url: coverUrl },
        },
      ],
    };
  }

  return { title, author, properties };
}

async function withRetry(task) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      const retryable =
        isNotionClientError(error) &&
        (error.code === "rate_limited" ||
          error.code === "conflict_error" ||
          error.code === "internal_server_error" ||
          error.code === "service_unavailable" ||
          error.code === "notionhq_client_request_timeout");
      if (!retryable || attempt === 5) {
        throw error;
      }
      const retryAfter = Number(error.headers?.get?.("retry-after"));
      const delayMs =
        Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * 2 ** attempt;
      console.warn(`Notion request failed (${error.code}). Retrying in ${delayMs}ms.`);
      await sleep(delayMs);
    }
  }
  throw new Error("Notion request failed");
}

async function listExistingKeys(notion, databaseId) {
  const keys = new Set();
  let startCursor;
  do {
    const page = await withRetry(() =>
      notion.databases.query({
        database_id: databaseId,
        page_size: 100,
        start_cursor: startCursor,
      }),
    );
    for (const item of page.results) {
      if (!("properties" in item)) {
        continue;
      }
      const title = plainText(item.properties.Title);
      const author = plainText(item.properties.Author);
      if (title) {
        keys.add(bookKey(title, author));
      }
    }
    startCursor = page.has_more && page.next_cursor ? page.next_cursor : undefined;
  } while (startCursor);
  return keys;
}

async function main() {
  const missing = missingEnv();
  if (missing.length > 0) {
    console.error(`Missing env: ${missing.join(", ")}`);
    process.exit(1);
  }

  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const databaseId = process.env.NOTION_BOOKS_DATABASE_ID;
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID,
  );
  const records = await base("Books").select({}).all();
  const existing = await listExistingKeys(notion, databaseId);

  let created = 0;
  let skipped = 0;

  for (const record of records) {
    const { title, author, properties } = notionProperties(record);
    if (!title) {
      skipped += 1;
      continue;
    }
    const key = bookKey(title, author);
    if (existing.has(key)) {
      skipped += 1;
      continue;
    }

    await withRetry(() =>
      notion.pages.create({
        parent: { database_id: databaseId },
        properties,
      }),
    );
    existing.add(key);
    created += 1;
    await sleep(400);
  }

  const after = await listExistingKeys(notion, databaseId);
  console.log(
    JSON.stringify({
      airtableRows: records.length,
      created,
      skipped,
      notionRows: after.size,
    }),
  );
}

if (process.argv[1]?.endsWith("copy-airtable-books-to-notion.mjs")) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
