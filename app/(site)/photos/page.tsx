import PhotosPage from "@/components/route-content/photos-page";
import { photosMetadata } from "@/lib/page-metadata";
import { getPhotos } from "@/lib/notion/api";
import { groupPhotosByTrip } from "@/lib/notion/photos";

export const metadata = photosMetadata;

export const revalidate = 3600;

export default async function Page() {
  const trips = groupPhotosByTrip(await getPhotos());

  return <PhotosPage trips={trips} />;
}
