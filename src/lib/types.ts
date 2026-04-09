export type ProductCategory = 'condiments' | 'herbal' | 'rice-other';

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  image: string;
  tag: string;
  price?: string;
  codex: string[];
  sortPriority?: number;
  productCategory?: ProductCategory;
  // Legacy field kept for backward compatibility with older Firestore docs
  // (historically stored with inconsistent labels)
  category?: string;
  // Legacy field kept for backward compatibility with older Firestore docs.
  features?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  category?: string;
  role?: string;
  image?: string;
}

export interface CategoryImage {
  id: ProductCategory;
  image: string;
}
