import { Text, VStack } from "@chakra-ui/react";

import Hero from "@/components/hero";
import PhotoTripGallery from "@/components/photo-trip-gallery";
import Section from "@/components/section";
import type { PhotoTrip } from "@/lib/notion/photos";

type PhotosPageProps = {
  trips: PhotoTrip[];
};

export default function PhotosPage({ trips }: PhotosPageProps) {
  return (
    <>
      <Hero title="Photos" subtitle="Photographs from trips" />
      <VStack align="stretch" gap={12} w="100%" mt={6}>
        {trips.length === 0 ? (
          <Section>
            <Text textAlign="center">No photos yet.</Text>
          </Section>
        ) : (
          trips.map((trip) => <PhotoTripGallery key={trip.trip} trip={trip} />)
        )}
      </VStack>
    </>
  );
}
