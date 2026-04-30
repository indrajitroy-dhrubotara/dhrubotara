import { useState, useEffect, useCallback } from 'react';
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export function useCollection<T extends { id: string }>(
  collectionName: string,
  options?: {
    initialData?: T[] | null;
    sort?: (data: T[]) => T[];
  }
) {
  const [data, setData] = useState<T[]>(options?.initialData || []);
  const [loading, setLoading] = useState(!options?.initialData);
  const [error, setError] = useState<string | null>(null);

  // Destructure options to avoid dependency on the options object itself
  const initialData = options?.initialData;
  const sort = options?.sort;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (!db) throw new Error("Firebase Firestore not initialized");

      const querySnapshot = await getDocs(collection(db, collectionName));
      let items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      
      if (sort) {
        items = sort(items);
      }
      
      setData(items);
    } catch (err) {
      console.error(`Error fetching ${collectionName}:`, err);
      setError(`Failed to load ${collectionName}`);
    } finally {
      setLoading(false);
    }
  }, [collectionName, sort]);

  useEffect(() => {
    // Only fetch if no initial data is provided
    if (!initialData) {
      fetchData();
    } else {
        // If initial data is provided, ensure loading is false
        setLoading(false);
    }
  }, [initialData, fetchData]);

  const saveItem = async (item: T) => {
    if (!db) throw new Error("Firebase Firestore not initialized");

    // Firestore rejects undefined values — strip them before writing
    const clean = Object.fromEntries(
      Object.entries(item).filter(([, v]) => v !== undefined)
    ) as T;

    const itemRef = doc(collection(db, collectionName), clean.id);
    await setDoc(itemRef, clean, { merge: true });
    await fetchData();
  };

  const deleteItem = async (id: string) => {
    if (!db) throw new Error("Firebase Firestore not initialized");
    
    await deleteDoc(doc(db, collectionName, id));
    await fetchData();
  };

  return { data, loading, error, saveItem, deleteItem, refresh: fetchData };
}
