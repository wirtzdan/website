import Link from "next/link";
import { NextSeo } from "next-seo";
import { Center, Heading } from "@chakra-ui/react";
import Container from "@/components/container";

export default function NotFound() {
  return (
    <Container>
      <Center>
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
      </Center>
    </Container>
  );
}
