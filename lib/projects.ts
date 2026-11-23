export const UTM_PARAMS = {
  utm_source: "danielwirtz.com",
  utm_medium: "referral",
} as const;

/**
 * Append the site's referral UTM params to an outbound URL. Existing query
 * params are kept; UTM keys that are already set are left as they are.
 */
export function withUtm(href: string): string {
  const url = new URL(href);
  for (const [key, value] of Object.entries(UTM_PARAMS)) {
    if (!url.searchParams.has(key)) {
      url.searchParams.append(key, value);
    }
  }
  return url.toString();
}

export type Project = {
  name: string;
  /** Official product URL, without UTM params. */
  url: string;
  blurb: string;
  /** Shown only when the product is not simply "live". */
  status?: string;
  /** A secondary install link that the product's own site points to. */
  install?: { label: string; url: string };
};

// Order matters: it is the order on /projects and on the homepage.
export const PROJECTS: readonly Project[] = [
  {
    name: "Clipper",
    url: "https://clipper.so",
    blurb:
      "I am building Clipper so you can save bookmarks, highlights, and notes to a Notion database with a single click.",
    status: "Beta",
    install: {
      label: "Add to Chrome",
      url: "https://chromewebstore.google.com/detail/cgfgpgeemfgnkbammdopjnophnmbmmin",
    },
  },
  {
    name: "Markway",
    url: "https://markway.io",
    blurb:
      "Markway is a browser extension I made so you can highlight text on any page, get a Markdown note, and send it to Roam, Notion, Obsidian, or your clipboard.",
  },
  {
    name: "UploadFloorplan",
    url: "https://uploadfloorplan.com",
    blurb:
      "UploadFloorplan turns a floor plan PDF or photo into a 3D room you can furnish, so you can see what fits.",
  },
  {
    name: "Jumpstack",
    url: "https://jumpstack.dev",
    blurb:
      "Jumpstack is a starter I put together with auth, payments, and a backend already wired up, so you can get a web app going without building those from scratch.",
  },
  {
    name: "Bordmate",
    url: "https://bordmate.com",
    blurb: "Bordmate is an app I made so you can track board games with friends.",
  },
];

/** The bare hostname, for display ("clipper.so"). */
export function displayHost(href: string): string {
  return new URL(href).hostname.replace(/^www\./, "");
}
