export type ProductCategory = 'condiments' | 'herbal' | 'rice-other';

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  image: string;
  tag: string;
  price?: string;
  features: string[];
  sortPriority?: number;
  productCategory?: ProductCategory;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  category?: string;
  role?: string;
  image?: string;
}
