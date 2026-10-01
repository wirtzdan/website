"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Box, Icon, Image, Text, chakra } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { useColorModeValue } from "@/components/ui/color-mode";
import type { Photo, PhotoTrip } from "@/lib/notion/photos";

const GAP = "6px";
const PlainButton = chakra("button");

type PhotoTripGalleryProps = {
  trip: PhotoTrip;
};

function stopAnd(handler: () => void) {
  return (event: MouseEvent) => {
    event.stopPropagation();
    handler();
  };
}

export default function PhotoTripGallery({ trip }: PhotoTripGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const labelColor = useColorModeValue("neutral.800", "neutralD.800");
  const photos = trip.photos;
  const active = activeIndex === null ? null : photos[activeIndex];
  const isOpen = active !== null;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
        return;
      }
      if (photos.length < 2) {
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((current) => (current === null ? current : (current + 1) % photos.length));
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((current) =>
          current === null ? current : (current - 1 + photos.length) % photos.length,
        );
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, photos.length]);

  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <Box w="100%" px={GAP}>
      <Text as="h2" fontSize="sm" fontWeight="medium" color={labelColor} mb={2}>
        {trip.trip}
      </Text>
      <Box
        css={{
          columnGap: GAP,
          columnCount: 1,
          "@media (min-width: 48em)": {
            columnCount: 3,
          },
        }}
      >
        {photos.map((photo, index) => (
          <PhotoTile key={photo.id} photo={photo} onOpen={() => setActiveIndex(index)} />
        ))}
      </Box>
      {active ? (
        <Box
          role="dialog"
          aria-modal="true"
          aria-label={`${trip.trip} photos`}
          position="fixed"
          inset={0}
          zIndex={200}
          bg="blackAlpha.800"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => setActiveIndex(null)}
        >
          <PlainButton
            ref={closeRef}
            type="button"
            aria-label="Close"
            position="absolute"
            top={4}
            right={4}
            color="white"
            bg="blackAlpha.600"
            borderWidth={0}
            rounded="full"
            w={10}
            h={10}
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            onClick={stopAnd(() => setActiveIndex(null))}
          >
            <Icon boxSize={6} asChild>
              <XMarkIcon />
            </Icon>
          </PlainButton>
          {photos.length > 1 ? (
            <>
              <OverlayButton
                label="Previous photo"
                side="left"
                onClick={() =>
                  setActiveIndex((current) =>
                    current === null ? current : (current - 1 + photos.length) % photos.length,
                  )
                }
              >
                <ChevronLeftIcon />
              </OverlayButton>
              <OverlayButton
                label="Next photo"
                side="right"
                onClick={() =>
                  setActiveIndex((current) =>
                    current === null ? current : (current + 1) % photos.length,
                  )
                }
              >
                <ChevronRightIcon />
              </OverlayButton>
            </>
          ) : null}
          <Image
            src={active.imageUrl}
            alt={active.caption ?? active.trip}
            maxW="92vw"
            maxH="78vh"
            w="auto"
            h="auto"
            onClick={(event) => event.stopPropagation()}
          />
          {active.caption ? (
            <Text
              position="absolute"
              bottom={6}
              left={6}
              right={6}
              textAlign="center"
              fontSize="sm"
              color="whiteAlpha.900"
              onClick={(event) => event.stopPropagation()}
            >
              {active.caption}
            </Text>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
}

function PhotoTile({ photo, onOpen }: { photo: Photo; onOpen: () => void }) {
  return (
    <PlainButton
      type="button"
      display="block"
      w="100%"
      mb={GAP}
      p={0}
      borderWidth={0}
      bg="transparent"
      cursor="pointer"
      lineHeight={0}
      css={{ breakInside: "avoid" }}
      onClick={onOpen}
    >
      <Image
        src={photo.imageUrl}
        alt={photo.caption ?? photo.trip}
        w="100%"
        h="auto"
        display="block"
      />
    </PlainButton>
  );
}

function OverlayButton({
  label,
  side,
  onClick,
  children,
}: {
  label: string;
  side: "left" | "right";
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <PlainButton
      type="button"
      aria-label={label}
      position="absolute"
      top="50%"
      left={side === "left" ? 4 : undefined}
      right={side === "right" ? 4 : undefined}
      transform="translateY(-50%)"
      color="white"
      bg="blackAlpha.600"
      borderWidth={0}
      rounded="full"
      w={10}
      h={10}
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      onClick={stopAnd(onClick)}
    >
      <Icon boxSize={6} asChild>
        {children}
      </Icon>
    </PlainButton>
  );
}
