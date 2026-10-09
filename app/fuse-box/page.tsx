import FuseBoxPage from "@/components/route-content/fuse-box-page";
import { fuseBoxMetadata } from "@/lib/page-metadata";

export const metadata = fuseBoxMetadata;

// A full-screen app shell, so it skips the site header and footer.
export default function Page() {
  return <FuseBoxPage />;
}
