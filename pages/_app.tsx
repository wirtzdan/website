import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { DefaultSeo } from "next-seo";
import PlausibleProvider from "next-plausible";
import { useEffect } from "react";
import { clarity } from "react-microsoft-clarity";

import FontFace from "@/components/font-face";
import SEO from "@/next-seo.config";
import customTheme from "@/theme";
import "@/lib/notion/notion-renderer-styles.css";
import "@/lib/notion/notion-custom-styles.css";
import "prismjs/themes/prism-tomorrow.css";

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    clarity.init("kcefbongzq");
  }, []);

  return (
    <>
      <ChakraProvider theme={customTheme}>
        <PlausibleProvider domain="danielwirtz.com">
          <Head>
            <meta content="width=device-width, initial-scale=1" name="viewport" />
            <link rel="icon" type="image/png" sizes="96x96" href="/favicon.png" />
            <meta name="theme-color" content="#2BB0EC" />
          </Head>
          <DefaultSeo {...SEO} />
          <Component {...pageProps} />
        </PlausibleProvider>
      </ChakraProvider>
      <FontFace />
    </>
  );
};

export default App;
