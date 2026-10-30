import type { Metadata } from "next";

import NotFoundBody from "@/components/not-found-body";
import Layout from "@/layouts/layout";

export const metadata: Metadata = {
  title: "404",
  description: "Page not found — Daniel Wirtz",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Layout>
      <NotFoundBody />
    </Layout>
  );
}
