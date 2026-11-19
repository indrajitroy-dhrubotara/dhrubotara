import { useCallback } from 'react';
import { useCollection } from './useCollection';
import {
  ARTIST_IMAGE_SLOTS,
  type ArtistImage,
  type ArtistImageSlot,
  type ArtistProfile,
} from './types';

const PROFILE_COLLECTION = 'artistAbout';
const IMAGES_COLLECTION = 'artistImages';
const PROFILE_ID = 'profile';

export function useArtistAbout() {
  const {
    data: profiles,
    loading: profileLoading,
    saveItem: saveProfileItem,
  } = useCollection<ArtistProfile>(PROFILE_COLLECTION);

  const {
    data: images,
    loading: imagesLoading,
    saveItem: saveImageItem,
    deleteItem: deleteImageItem,
  } = useCollection<ArtistImage>(IMAGES_COLLECTION);

  const profile = profiles.find((item) => item.id === PROFILE_ID);
  const loading = profileLoading || imagesLoading;

  const getImage = useCallback(
    (slot: ArtistImageSlot): string | undefined => {
      return images.find((item) => item.id === slot)?.image;
    },
    [images],
  );

  const saveProfile = useCallback(
    async (name: string, description: string) => {
      const trimmedName = name.trim();
      await saveProfileItem({
        id: PROFILE_ID,
        description: description.trim(),
        name: trimmedName,
      });
    },
    [saveProfileItem],
  );

  const saveImage = useCallback(
    async (slot: ArtistImageSlot, imageUrl: string) => {
      await saveImageItem({ id: slot, image: imageUrl });
    },
    [saveImageItem],
  );

  const removeImage = useCallback(
    async (slot: ArtistImageSlot) => {
      await deleteImageItem(slot);
    },
    [deleteImageItem],
  );

  const slotImages = ARTIST_IMAGE_SLOTS.map((slot) => getImage(slot));

  return {
    name: profile?.name ?? '',
    description: profile?.description ?? '',
    slotImages,
    loading,
    getImage,
    saveProfile,
    saveImage,
    removeImage,
  };
}
