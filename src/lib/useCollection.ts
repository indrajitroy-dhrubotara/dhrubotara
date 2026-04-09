import { useState, useEffect, useCallback } from 'react';
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

interface MutationOptions {
  refresh?: boolean;
}

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

  const applySort = useCallback((items: T[]) => {
    return sort ? sort(items) : items;
  }, [sort]);

  useEffect(() => {
    // Only fetch if no initial data is provided
    if (!initialData) {
      fetchData();
    } else {
        // If initial data is provided, ensure loading is false
        setLoading(false);
    }
  }, [initialData, fetchData]);

  const saveItem = async (item: T, options?: MutationOptions) => {
    if (!db) throw new Error("Firebase Firestore not initialized");

    const itemRef = doc(collection(db, collectionName), item.id);
    await setDoc(itemRef, item, { merge: true });

    // Optimistic local update for faster UI response
    setData((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === item.id);
      if (existingIndex === -1) {
        return applySort([...prev, item]);
      }

      const next = [...prev];
      next[existingIndex] = { ...next[existingIndex], ...item };
      return applySort(next);
    });

    if (options?.refresh ?? true) {
      await fetchData();
    }
  };

  const deleteItem = async (id: string, options?: MutationOptions) => {
    if (!db) throw new Error("Firebase Firestore not initialized");
    
    await deleteDoc(doc(db, collectionName, id));
    setData((prev) => prev.filter((item) => item.id !== id));

    if (options?.refresh ?? true) {
      await fetchData();
    }
  };

  return { data, loading, error, saveItem, deleteItem, refresh: fetchData };
}
