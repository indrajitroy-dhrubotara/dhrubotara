import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export async function uploadToStorage(folder: string, file: File): Promise<string> {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized');
  }

  const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
