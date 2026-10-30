import { revalidatePath, revalidateTag } from "next/cache";

import { readRevalidateBody, readRevalidateSecret, secretsMatch } from "@/lib/content-cache";
import { allowRequest, clientIp } from "@/lib/public-api";

const NO_STORE = { "Cache-Control": "no-store" } as const;

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: NO_STORE });
}

export async function POST(request: Request) {
  const allowed = await allowRequest({
    scope: "revalidate",
    ip: clientIp(request),
    limit: 30,
    windowSeconds: 60,
  });
  if (!allowed) {
    return json({ revalidated: false }, 429);
  }

  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    console.error("REVALIDATE_SECRET is unset; refusing on-demand revalidation");
    return json({ revalidated: false }, 401);
  }

  if (!secretsMatch(readRevalidateSecret(request), expected)) {
    return json({ revalidated: false }, 401);
  }

  const parsed = await readRevalidateBody(request);
  if (parsed.ok === false) {
    return json({ revalidated: false }, parsed.status);
  }

  // Expire immediately. `max` would keep serving the stale page for up to a year.
  for (const tag of parsed.plan.tags) {
    revalidateTag(tag, { expire: 0 });
  }
  for (const path of parsed.plan.paths) {
    revalidatePath(path);
  }
  for (const path of parsed.plan.dynamicPaths) {
    revalidatePath(path, "page");
  }

  return json({
    revalidated: true,
    tags: parsed.plan.tags,
    paths: [...parsed.plan.paths, ...parsed.plan.dynamicPaths],
  });
}
