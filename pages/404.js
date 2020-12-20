import Link from "next/link";
import { NextSeo } from "next-seo";
import { Heading } from "@chakra-ui/react";

import Container from "@/components/Container";

export default function NotFound() {
  return (
    <Container>
      <NextSeo
        title="404 – Daniel Wirtz"
        canonical="https://danielwirtz.com/404"
        openGraph={{
          url: "https://danielwirtz.com/404",
          title: "404 – Daniel Wirtz",
        }}
      />
      <Heading>404</Heading>
      <Link href="/">Return Home</Link>
    </Container>
  );
}
