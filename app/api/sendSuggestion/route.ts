import Airtable from "airtable";

import type { SuggestionPayload, SuggestionResponseBody } from "@/types/api";

function getSuggestionsTable() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) {
    throw new Error("Airtable is not configured");
  }
  return new Airtable({ apiKey }).base(baseId)("Suggestions");
}

export async function POST(request: Request) {
  let body: SuggestionPayload;
  try {
    body = (await request.json()) as SuggestionPayload;
  } catch {
    return Response.json({ error: "Invalid JSON" } satisfies SuggestionResponseBody, {
      status: 400,
    });
  }

  try {
    await sendSuggestion(body);
    return Response.json({ error: "" } satisfies SuggestionResponseBody);
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to send suggestion",
      } satisfies SuggestionResponseBody,
      { status: 405 },
    );
  }
}

function sendSuggestion(data: SuggestionPayload) {
  const { title, author, message } = data;
  const table = getSuggestionsTable();

  return new Promise<void>((resolve, reject) => {
    table.create(
      {
        Title: title,
        Author: author,
        Message: message,
      },
      (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      },
    );
  });
}
