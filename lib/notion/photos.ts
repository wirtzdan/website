import { getFilesProperty, getStringProperty } from "./utils";

export type NotionPhotoSource = {
  id: string;
  properties?: Record<string, any>;
};

export type Photo = {
  id: string;
  trip: string;
  imageUrl: string;
  caption: string | null;
  date: string | null;
};

export type PhotoTrip = {
  trip: string;
  photos: Photo[];
};

function readOptionalText(source: NotionPhotoSource, propertyName: string): string | null {
  const value = getStringProperty(source, propertyName)?.trim();
  return value ? value : null;
}

function readPhotoDate(source: NotionPhotoSource): string | null {
  const start = readOptionalText(source, "Date");
  if (!start || Number.isNaN(Date.parse(start))) {
    return null;
  }

  return start;
}

export function mapNotionPhoto(source: NotionPhotoSource): Photo | null {
  const imageUrl = getFilesProperty(source, "Photo");
  const trip = readOptionalText(source, "Trip");
  if (!imageUrl || !trip) {
    return null;
  }

  return {
    id: source.id,
    trip,
    imageUrl,
    caption: readOptionalText(source, "Caption"),
    date: readPhotoDate(source),
  };
}

function timestamp(date: string | null): number | null {
  if (!date) {
    return null;
  }

  const time = Date.parse(date);
  return Number.isNaN(time) ? null : time;
}

function latestTimestamp(photos: Photo[]): number | null {
  let latest: number | null = null;

  for (const photo of photos) {
    const time = timestamp(photo.date);
    if (time === null) {
      continue;
    }
    if (latest === null || time > latest) {
      latest = time;
    }
  }

  return latest;
}

function comparePhotos(left: Photo, right: Photo): number {
  const leftTime = timestamp(left.date);
  const rightTime = timestamp(right.date);

  if (leftTime === null && rightTime === null) {
    return 0;
  }
  if (leftTime === null) {
    return 1;
  }
  if (rightTime === null) {
    return -1;
  }

  return leftTime - rightTime;
}

function compareTrips(left: PhotoTrip, right: PhotoTrip): number {
  const leftLatest = latestTimestamp(left.photos);
  const rightLatest = latestTimestamp(right.photos);

  if (leftLatest === null && rightLatest === null) {
    return left.trip.localeCompare(right.trip);
  }
  if (leftLatest === null) {
    return 1;
  }
  if (rightLatest === null) {
    return -1;
  }
  if (leftLatest !== rightLatest) {
    return rightLatest - leftLatest;
  }

  return left.trip.localeCompare(right.trip);
}

export function groupPhotosByTrip(photos: Photo[]): PhotoTrip[] {
  const groups = new Map<string, Photo[]>();

  for (const photo of photos) {
    const existing = groups.get(photo.trip);
    if (existing) {
      existing.push(photo);
    } else {
      groups.set(photo.trip, [photo]);
    }
  }

  return Array.from(groups, ([trip, items]) => ({
    trip,
    photos: [...items].sort(comparePhotos),
  })).sort(compareTrips);
}
