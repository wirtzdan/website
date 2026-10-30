import { Text, VStack } from "@chakra-ui/react";

import Hero from "@/components/hero";
import PhotoTripGallery from "@/components/photo-trip-gallery";
import Section from "@/components/section";
import { withPhotoDimensions } from "@/lib/image-dimensions";
import type { PhotoTrip } from "@/lib/notion/photos";

type PhotosPageProps = {
  trips: PhotoTrip[];
};

export default async function PhotosPage({ trips }: PhotosPageProps) {
  const sizedTrips = await withPhotoDimensions(trips);

  return (
    <>
      <Hero title="Photos" subtitle="Photographs from trips" />
      <VStack align="stretch" gap={12} w="100%" mt={6}>
        {sizedTrips.length === 0 ? (
          <Section>
            <Text textAlign="center">No photos yet.</Text>
          </Section>
        ) : (
          <Section>
            <VStack align="stretch" gap={12} w="100%">
              {sizedTrips.map((trip, tripIndex) => (
                <PhotoTripGallery
                  key={trip.trip}
                  trip={trip}
                  prioritizeFirstRow={tripIndex === 0}
                />
              ))}
            </VStack>
          </Section>
        )}
      </VStack>
    </>
  );
}
