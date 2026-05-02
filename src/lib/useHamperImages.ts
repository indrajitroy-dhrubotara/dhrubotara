import { useCollection } from './useCollection';
import { type HamperImage } from './types';

const sortByOrder = (items: HamperImage[]) =>
  [...items].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));

export function useHamperImages() {
  const { data, loading, saveItem, deleteItem, refresh } = useCollection<HamperImage>('hamperImages', {
    sort: sortByOrder,
  });

  const addImage = async (imageUrl: string) => {
    const nextOrder = data.length > 0
      ? Math.max(...data.map((i) => i.sortOrder ?? 0)) + 1
      : 0;
    const id = `hamper-${Date.now()}`;
    await saveItem({ id, image: imageUrl, sortOrder: nextOrder });
  };

  const replaceImage = async (id: string, imageUrl: string) => {
    const existing = data.find((i) => i.id === id);
    await saveItem({ id, image: imageUrl, sortOrder: existing?.sortOrder });
  };

  const removeImage = async (id: string) => {
    await deleteItem(id);
  };

  return { hamperImages: data, loading, addImage, replaceImage, removeImage, refresh };
}
