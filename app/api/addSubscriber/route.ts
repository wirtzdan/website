import type { AddSubscriberResponseBody } from "@/types/api";

import {
  GENERIC_UPSTREAM_ERROR,
  SUBSCRIBE_LIMIT,
  SUBSCRIBE_WINDOW_SECONDS,
  guardPublicPost,
  jsonResponse,
  parseSubscriber,
} from "@/lib/public-api";

export async function POST(request: Request) {
  const guarded = await guardPublicPost(request, {
    scope: "add-subscriber",
    limit: SUBSCRIBE_LIMIT,
    windowSeconds: SUBSCRIBE_WINDOW_SECONDS,
    successStatus: 201,
  });

  if (guarded.kind === "response") {
    return guarded.response;
  }

  const parsed = parseSubscriber(guarded.body);
  if (parsed.ok === false) {
    return jsonResponse({ error: parsed.error } satisfies AddSubscriberResponseBody, 400);
  }

  try {
    const apiKey = process.env.BUTTONDOWN_API_KEY;
    if (!apiKey) {
      console.error("Buttondown subscribe failed: BUTTONDOWN_API_KEY is unset");
      return jsonResponse(
        { error: GENERIC_UPSTREAM_ERROR } satisfies AddSubscriberResponseBody,
        500,
      );
    }

    const response = await fetch("https://api.buttondown.email/v1/subscribers", {
      body: JSON.stringify({ email: parsed.value.email }),
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (response.status >= 400) {
      const detail = await response.text();
      console.error("Buttondown subscribe failed", response.status, detail.slice(0, 500));
      return jsonResponse(
        { error: GENERIC_UPSTREAM_ERROR } satisfies AddSubscriberResponseBody,
        502,
      );
    }

    return jsonResponse({ error: "" } satisfies AddSubscriberResponseBody, 201);
  } catch (error) {
    console.error("Buttondown subscribe failed", error);
    return jsonResponse({ error: GENERIC_UPSTREAM_ERROR } satisfies AddSubscriberResponseBody, 500);
  }
}
