import { useCollection } from './useCollection';
import { type StoryImage, type StoryImageSlot } from './types';

export function useStoryImages() {
  const { data, loading, saveItem, refresh } = useCollection<StoryImage>('storyImages');

  const saveImage = async (id: StoryImageSlot, imageUrl: string) => {
    await saveItem({ id, image: imageUrl });
  };

  const getImage = (id: StoryImageSlot): string | undefined => {
    return data.find((s) => s.id === id)?.image;
  };

  return { storyImages: data, loading, saveImage, getImage, refresh };
}
