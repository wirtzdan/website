import type { NextApiRequest, NextApiResponse } from "next";

import type { AddSubscriberRequestBody, AddSubscriberResponseBody } from "@/types/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AddSubscriberResponseBody>
) {
  const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as AddSubscriberRequestBody;
  const { email } = body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const apiKey = process.env.BUTTONDOWN_API_KEY;
    const response = await fetch("https://api.buttondown.email/v1/subscribers", {
      body: JSON.stringify({ email }),
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const responseJson = (await response.json()) as string[] | { error?: string };

    if (response.status >= 400) {
      return res.status(400).json({
        error: Array.isArray(responseJson) ? responseJson[0] ?? "Subscription failed" : responseJson.error ?? "Subscription failed",
      });
    }

    return res.status(201).json({ error: "" });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
