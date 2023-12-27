import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="preload"
            href="https://fonts.googleapis.com/css2?family=Sora:ital,wght@0,400;0,500;0,700;0,900;1,400;1,500;1,700;1,900&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
            rel="stylesheet"
          />

          <link
            rel="preload"
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap"
            rel="stylesheet"
          />
          <link href="/static/favicons/favicon.ico" rel="shortcut icon" />
          <link href="/static/favicons/site.webmanifest" rel="manifest" />
          <link
            href="/static/favicons/apple-touch-icon.png"
            rel="apple-touch-icon"
            sizes="180x180"
          />
          <link
            href="/static/favicons/favicon-32x32.png"
            rel="icon"
            sizes="32x32"
            type="image/png"
          />
          <link
            href="/static/favicons/favicon-16x16.png"
            rel="icon"
            sizes="16x16"
            type="image/png"
          />
          <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
          <meta content="#3182CE" name="theme-color" />
          <meta content="#3182CE" name="msapplication-TileColor" />
          <meta
            name="impact-site-verification"
            value="2096415d-8a81-4e03-9a1f-67bcd203a8c2"
          ></meta>
          <meta
            content="/static/favicons/browserconfig.xml"
            name="msapplication-config"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
