"use client";

import RouteErrorScreen from "@/components/route-error";
import Layout from "@/layouts/layout";

export default function RouteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Layout>
      <RouteErrorScreen reset={reset} />
    </Layout>
  );
}
