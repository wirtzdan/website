import type { Attachment, FieldSet } from "airtable";
import type { getPageTitle } from "notion-utils";

export type NotionRecordMap = Parameters<typeof getPageTitle>[0];

export interface NotionBlockValue {
  type?: string;
  properties?: {
    title?: Array<[string, ...unknown[]]>;
  };
}

export interface NotionBlockWithValue {
  id?: string;
  space_id?: string;
  role?: string;
  value?: NotionBlockValue;
}

export type NotionRecordMapWithBlocks = NotionRecordMap & {
  block: Record<string, NotionBlockWithValue>;
};

export interface PaginatedResults<T> {
  results: T[];
  hasMore: boolean;
  next_cursor: string | null;
}

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  publishDate: string;
  modifiedDate?: string;
  isFeatured: boolean;
  isPublished: boolean;
  coverImage: string | null;
  coverVideo: string | null;
  socialImage: string | null;
  readURL: string;
  coverIcon: string | null;
}

export interface GenericPageSummary {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  showNavigation: boolean;
  readURL: string;
}

export interface AirtableImageThumbnail {
  url: string;
}

export type AirtableImage = Attachment;

export interface AirtableRecord<TFields extends FieldSet = FieldSet> {
  id: string;
  fields: TFields;
}

export interface BookFields extends FieldSet {
  Title?: string;
  Author?: string;
  Rating?: number;
  Favorite?: boolean;
  Cover?: AirtableImage[];
  Read?: boolean;
  "Date Read"?: string;
}

export interface ToolFields extends FieldSet {
  Name?: string;
  Description?: string;
  Image?: AirtableImage[];
  Platform?: string;
  Affiliate?: boolean;
  Link?: string;
  ID?: string | number;
}

export interface NewsletterFields extends FieldSet {
  Status?: string;
  Slug?: string;
  Issue?: number;
  Subject?: string;
  "Published on"?: string;
  "Pulished On"?: string;
  "Social Card"?: AirtableImage[];
}

export interface BookmarkItem {
  title: string;
  cover: string;
  created: string;
  excerpt?: string;
  type: string;
  link: string;
}

export interface BookmarkResponse {
  items: BookmarkItem[];
}
