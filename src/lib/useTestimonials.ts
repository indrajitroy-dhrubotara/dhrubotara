import { useCollection } from './useCollection';
import type { Testimonial } from './types';

const sortByOrder = (items: Testimonial[]) =>
  [...items].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));

export function useTestimonials() {
  const {
    data: testimonials,
    loading,
    error,
    saveItem: saveTestimonial,
    deleteItem: deleteTestimonial,
    refresh
  } = useCollection<Testimonial>("testimonials", { sort: sortByOrder });

  return { testimonials, loading, error, saveTestimonial, deleteTestimonial, refresh };
}
