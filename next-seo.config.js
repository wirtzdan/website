const title = "Daniel Wirtz";
const description =
  "Designer and Co-Founder of Crisp Studio. I grew up in Germany and now live in Utrecht, the Netherlands.";

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
        width: 1280,
        height: 720,
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
