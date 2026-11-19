export type ProductCategory = 'condiments' | 'herbal' | 'rice-other' | 'accessories';

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  image: string;
  tag: string;
  price?: string;
  weight?: string;
  features?: string[];
  // Legacy field name used by codex branch — treated as alias for features
  codex?: string[];
  sortPriority?: number;
  productCategory?: ProductCategory;
  // Legacy field kept for backward compatibility with older Firestore docs
  // (historically stored with inconsistent labels)
  category?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  category?: string;
  role?: string;
  image?: string;
  sortPriority?: number;
}

export interface CategoryImage {
  id: ProductCategory;
  image: string;
}

export interface HamperImage {
  id: string;
  image: string;
  sortPriority?: number;
}

export interface StoryImage {
  id: string;
  image: string;
  sortPriority?: number;
}

export const ARTIST_IMAGE_SLOTS = ['1', '2', '3', '4'] as const;
export type ArtistImageSlot = (typeof ARTIST_IMAGE_SLOTS)[number];

export interface ArtistProfile {
  id: string;
  name?: string;
  description: string;
}

export interface ArtistImage {
  id: ArtistImageSlot;
  image: string;
}
