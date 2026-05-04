import { useCallback } from 'react';
import { writeBatch, doc, collection } from 'firebase/firestore';
import { useCollection } from './useCollection';
import { db } from './firebase';
import type { Testimonial } from './types';

const COLLECTION = 'testimonials';

const sortTestimonials = (items: Testimonial[]): Testimonial[] =>
  [...items].sort((a, b) => {
    const aPriority = a.sortPriority ?? Number.MAX_SAFE_INTEGER;
    const bPriority = b.sortPriority ?? Number.MAX_SAFE_INTEGER;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return a.id.localeCompare(b.id);
  });

export function useTestimonials() {
  const {
    data: testimonials,
    loading,
    error,
    saveItem: saveTestimonial,
    deleteItem: deleteTestimonial,
    refresh,
  } = useCollection<Testimonial>(COLLECTION, { sort: sortTestimonials });

  // Batch-update sortPriority for the testimonials whose order changed.
  // Accepts the desired ordered list of testimonial ids.
  const reorderTestimonials = useCallback(
    async (orderedIds: string[]) => {
      if (!db) throw new Error('Firebase Firestore not initialized');
      const batch = writeBatch(db);
      orderedIds.forEach((id, index) => {
        const ref = doc(collection(db, COLLECTION), id);
        batch.set(ref, { sortPriority: index + 1 }, { merge: true });
      });
      await batch.commit();
      await refresh();
    },
    [refresh]
  );

  return {
    testimonials,
    loading,
    error,
    saveTestimonial,
    deleteTestimonial,
    reorderTestimonials,
    refresh,
  };
}
