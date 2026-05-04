import { useCallback, useMemo } from 'react';
import { useCollection } from './useCollection';
import { type HamperImage } from './types';

const COLLECTION = 'hamperImages';

const sortHamperImages = (items: HamperImage[]): HamperImage[] =>
  [...items].sort((a, b) => {
    const aPriority = a.sortPriority ?? 999;
    const bPriority = b.sortPriority ?? 999;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return a.id.localeCompare(b.id);
  });

export function useHamperImages() {
  const { data, loading, saveItem, deleteItem, refresh } = useCollection<HamperImage>(
    COLLECTION,
    { sort: sortHamperImages }
  );

  const addImage = useCallback(
    async (imageUrl: string, sortPriority?: number) => {
      const id = `hamper-${Date.now()}`;
      await saveItem({ id, image: imageUrl, sortPriority });
      return id;
    },
    [saveItem]
  );

  const updateImage = useCallback(
    async (id: string, imageUrl: string, sortPriority?: number) => {
      await saveItem({ id, image: imageUrl, sortPriority });
    },
    [saveItem]
  );

  const removeImage = useCallback(
    async (id: string) => {
      await deleteItem(id);
    },
    [deleteItem]
  );

  const images = useMemo(() => data, [data]);

  return { images, loading, addImage, updateImage, removeImage, refresh };
}
