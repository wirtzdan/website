import type { ReactNode } from "react";

import Layout from "@/layouts/layout";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}
