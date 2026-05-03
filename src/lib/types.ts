export type ProductCategory = 'condiments' | 'herbal' | 'rice-other';

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
  sortOrder?: number;
}

export interface CategoryImage {
  id: ProductCategory;
  image: string;
}

export interface HamperImage {
  id: string;
  image: string;
  sortOrder?: number;
}

export type StoryImageSlot = 'about' | 'story-hero';

export interface StoryImage {
  id: StoryImageSlot;
  image: string;
}
