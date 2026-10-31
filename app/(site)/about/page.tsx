import JsonLd from "@/components/json-ld";
import AboutPage from "@/components/route-content/about-page";
import { profilePageJsonLd } from "@/lib/json-ld";
import { aboutMetadata } from "@/lib/page-metadata";

export const metadata = aboutMetadata;

export default function Page() {
  return (
    <>
      <JsonLd data={[profilePageJsonLd()]} />
      <AboutPage />
    </>
  );
}
