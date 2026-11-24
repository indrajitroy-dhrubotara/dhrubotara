import { type Product, type ProductCategory } from './types';

export const PRODUCT_CATEGORY_IDS: ProductCategory[] = [
  'condiments',
  'herbal',
  'rice-other',
  'accessories',
];

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  condiments: 'Pickles & Condiments',
  herbal: 'Herbal Medicines',
  'rice-other': 'Rice & Other Products',
  accessories: 'Art Accessories',
};

export function isProductCategory(value: string): value is ProductCategory {
  return (PRODUCT_CATEGORY_IDS as string[]).includes(value);
}

export function resolveProductCategory(product: Product): ProductCategory | undefined {
  if (product.productCategory && isProductCategory(product.productCategory)) {
    return product.productCategory;
  }

  const legacy = product.category?.trim().toLowerCase();
  if (!legacy) return undefined;

  if (['condiments', 'pickle', 'pickles', 'pickles & condiments', 'pickles and condiments'].includes(legacy)) {
    return 'condiments';
  }

  if (['herbal', 'herbal medicines', 'natural remedies', 'remedies'].includes(legacy)) {
    return 'herbal';
  }

  if (['rice-other', 'rice_other', 'rice & other', 'rice and other', 'rice & other products', 'rice and other products'].includes(legacy)) {
    return 'rice-other';
  }

  if (['accessories', 'art', 'art accessories', 'hand painted', 'hand-painted'].includes(legacy)) {
    return 'accessories';
  }

  return undefined;
}
