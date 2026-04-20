import { useCollection } from './useCollection';
import { type CategoryImage, type ProductCategory } from './types';

export function useCategoryImages() {
  const { data, loading, saveItem, refresh } = useCollection<CategoryImage>('categoryImages');

  const saveImage = async (id: ProductCategory, imageUrl: string) => {
    await saveItem({ id, image: imageUrl });
  };

  const getImage = (id: ProductCategory): string | undefined => {
    return data.find((c) => c.id === id)?.image;
  };

  return { categoryImages: data, loading, saveImage, getImage, refresh };
}
