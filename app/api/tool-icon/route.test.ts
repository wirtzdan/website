import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

const RECORD = "rec0123456789abcd";
const FILE = "att0123456789abcd";

const tools = (url: string) => [
  {
    id: RECORD,
    fields: { Name: "Raindrop", Image: [{ id: FILE, url, thumbnails: { large: { url } } }] },
  },
];

const airtable = vi.hoisted(() => ({ getTable: vi.fn(), getFreshTools: vi.fn() }));
vi.mock("@/lib/airtable", () => airtable);

const { GET } = await import("./route");

const request = (record = RECORD, file = FILE) =>
  new Request(`https://danielwirtz.com/api/tool-icon?record=${record}&file=${file}`);

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

test("serves the icon with a long edge cache", async () => {
  airtable.getTable.mockResolvedValue(tools("https://v5.airtableusercontent.com/fresh.png"));
  fetchMock.mockResolvedValue(new Response("png", { headers: { "content-type": "image/png" } }));

  const response = await GET(request());

  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toBe("image/png");
  expect(response.headers.get("cache-control")).toContain("s-maxage=2592000");
  expect(airtable.getFreshTools).not.toHaveBeenCalled();
});

test("refreshes an expired signed URL from Airtable once", async () => {
  airtable.getTable.mockResolvedValue(tools("https://v5.airtableusercontent.com/expired.png"));
  airtable.getFreshTools.mockResolvedValue(tools("https://v5.airtableusercontent.com/fresh.png"));
  fetchMock.mockImplementation(async (url: string) =>
    url.endsWith("expired.png")
      ? new Response(null, { status: 410 })
      : new Response("png", { headers: { "content-type": "image/png" } }),
  );

  const response = await GET(request());

  expect(response.status).toBe(200);
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

test("unknown or malformed ids never reach Airtable's fresh lookup or the network", async () => {
  airtable.getTable.mockResolvedValue(tools("https://v5.airtableusercontent.com/fresh.png"));

  expect((await GET(request("recxxxxxxxxxxxxxx"))).status).toBe(404);
  expect((await GET(request("bad", FILE))).status).toBe(400);
  expect(airtable.getFreshTools).not.toHaveBeenCalled();
  expect(fetchMock).not.toHaveBeenCalled();
});
