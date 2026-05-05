import { useCallback, useMemo } from 'react';
import { useCollection } from './useCollection';
import { type StoryImage } from './types';

const COLLECTION = 'storyImages';

const sortStoryImages = (items: StoryImage[]): StoryImage[] =>
  [...items].sort((a, b) => {
    const aPriority = a.sortPriority ?? 999;
    const bPriority = b.sortPriority ?? 999;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return a.id.localeCompare(b.id);
  });

export function useStoryImages() {
  const { data, loading, saveItem, deleteItem, refresh } = useCollection<StoryImage>(
    COLLECTION,
    { sort: sortStoryImages }
  );

  const addImage = useCallback(
    async (imageUrl: string, sortPriority?: number) => {
      const id = `story-${Date.now()}`;
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
