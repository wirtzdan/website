import { Heading, Image, Text, VStack } from "@chakra-ui/react";

import Hero from "@/components/hero";
import Section from "@/components/section";
import type { PhotoTrip } from "@/lib/notion/photos";

type PhotosPageProps = {
  trips: PhotoTrip[];
};

export default function PhotosPage({ trips }: PhotosPageProps) {
  return (
    <>
      <Hero title="Photos" subtitle="Photographs from trips" />
      <VStack gap={12} mt={6}>
        {trips.length === 0 ? (
          <Section>
            <Text textAlign="center">No photos yet.</Text>
          </Section>
        ) : (
          trips.map((trip) => (
            <Section key={trip.trip}>
              <VStack align="stretch" gap={8} w="100%">
                <Heading as="h2" size="lg">
                  {trip.trip}
                </Heading>
                {trip.photos.map((photo) => (
                  <VStack key={photo.id} align="stretch" gap={2}>
                    <Image
                      src={photo.imageUrl}
                      alt={photo.caption ?? photo.trip}
                      w="100%"
                      h="auto"
                      fit="contain"
                      display="block"
                    />
                    {photo.caption ? <Text fontSize="sm">{photo.caption}</Text> : null}
                  </VStack>
                ))}
              </VStack>
            </Section>
          ))
        )}
      </VStack>
    </>
  );
}
