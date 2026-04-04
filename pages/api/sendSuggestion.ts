import Airtable from "airtable";
import type { NextApiRequest, NextApiResponse } from "next";

import type { SuggestionPayload, SuggestionResponseBody } from "@/types/api";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuggestionResponseBody>
) {
  const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as SuggestionPayload;

  try {
    await sendSuggestion(body);
    return res.status(200).json({ error: "" });
  } catch (error) {
    return res.status(405).json({
      error: error instanceof Error ? error.message : "Failed to send suggestion",
    });
  }
}

function sendSuggestion(data: SuggestionPayload) {
  const { title, author, message } = data;
  const table = base("Suggestions");

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
      }
    );
  });
}
