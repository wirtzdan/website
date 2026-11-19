import NotionPageView from "@/components/notion-page-view";
import { leadingNotionImageSrc } from "@/lib/notion-image-frame";
import { withMeasuredNotionImages } from "@/lib/notion-image-measure";
import type { NotionRecordMap } from "@/types/content";

interface NotionPageProps {
  recordMap: NotionRecordMap | null;
  rootPageId?: string;
  rootDomain?: string;
}

export default async function NotionPage({ recordMap, rootPageId, rootDomain }: NotionPageProps) {
  if (!recordMap) {
    return null;
  }

  const framedRecordMap = await withMeasuredNotionImages(recordMap);
  const leadingImageSrc = leadingNotionImageSrc(framedRecordMap);

  return (
    <NotionPageView
      recordMap={framedRecordMap}
      rootPageId={rootPageId}
      rootDomain={rootDomain}
      leadingImageSrc={leadingImageSrc}
    />
  );
}
