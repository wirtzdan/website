import Airtable from "airtable";

import type { SuggestionResponseBody } from "@/types/api";

import {
  GENERIC_UPSTREAM_ERROR,
  SUGGESTION_LIMIT,
  SUGGESTION_WINDOW_SECONDS,
  guardPublicPost,
  jsonResponse,
  parseSuggestion,
  type SuggestionInput,
} from "@/lib/public-api";

function getSuggestionsTable() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) {
    throw new Error("Airtable is not configured");
  }
  return new Airtable({ apiKey }).base(baseId)("Suggestions");
}

function writeSuggestion(input: SuggestionInput) {
  const table = getSuggestionsTable();
  const fields: { Title: string; Author: string; Message?: string } = {
    Title: input.title,
    Author: input.author,
  };
  if (input.message) {
    fields.Message = input.message;
  }

  return new Promise<void>((resolve, reject) => {
    table.create(fields, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

export async function POST(request: Request) {
  const guarded = await guardPublicPost(request, {
    scope: "send-suggestion",
    limit: SUGGESTION_LIMIT,
    windowSeconds: SUGGESTION_WINDOW_SECONDS,
    successStatus: 200,
  });

  if (guarded.kind === "response") {
    return guarded.response;
  }

  const parsed = parseSuggestion(guarded.body);
  if (parsed.ok === false) {
    return jsonResponse({ error: parsed.error } satisfies SuggestionResponseBody, 400);
  }

  try {
    await writeSuggestion(parsed.value);
    return jsonResponse({ error: "" } satisfies SuggestionResponseBody);
  } catch (error) {
    console.error("Airtable suggestion failed", error);
    return jsonResponse({ error: GENERIC_UPSTREAM_ERROR } satisfies SuggestionResponseBody, 500);
  }
}
