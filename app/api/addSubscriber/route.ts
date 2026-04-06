import type { AddSubscriberRequestBody, AddSubscriberResponseBody } from "@/types/api";

export async function POST(request: Request) {
  let body: AddSubscriberRequestBody;
  try {
    body = (await request.json()) as AddSubscriberRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON" } satisfies AddSubscriberResponseBody, {
      status: 400,
    });
  }

  const { email } = body;

  if (!email) {
    return Response.json({ error: "Email is required" } satisfies AddSubscriberResponseBody, {
      status: 400,
    });
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
      return Response.json(
        {
          error: Array.isArray(responseJson)
            ? (responseJson[0] ?? "Subscription failed")
            : (responseJson.error ?? "Subscription failed"),
        } satisfies AddSubscriberResponseBody,
        { status: 400 },
      );
    }

    return Response.json({ error: "" } satisfies AddSubscriberResponseBody, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
      } satisfies AddSubscriberResponseBody,
      { status: 500 },
    );
  }
}
