const title = "Daniel Wirtz";
const description = "Designer, developer and maker of things. ";

const SEO = {
  title,
  description,
  canonical: "https://danielwirtz.com",
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://danielwirtz.com",
    title,
    description,
    images: [
      {
        url: "https://danielwirtz.com/static/images/banner.jpg",
        alt: title,
        width: 2240,
        height: 1260,
      },
    ],
  },
  twitter: {
    handle: "@wirtzdan",
    site: "@wirtzdan",
    cardType: "summary_large_image",
  },
};

export default SEO;
