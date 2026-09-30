"use client";

import { Edit2, Plus, Trash2 } from 'lucide-react';
import { type Testimonial } from '@/lib/types';

interface TestimonialsTabProps {
  testimonials: Testimonial[];
  loading: boolean;
  onCreate: () => void;
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (id: string) => void;
}

export function TestimonialsTab({
  testimonials,
  loading,
  onCreate,
  onEdit,
  onDelete,
}: TestimonialsTabProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl text-emerald-950">Testimonials</h2>
        <button
          onClick={onCreate}
          className="bg-emerald-800 text-white px-4 py-2 rounded-sm flex items-center hover:bg-emerald-700 transition-all shadow-sm text-sm cursor-pointer active:scale-95"
        >
          <Plus size={16} className="mr-2" /> Add Review
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-500">Loading reviews...</div>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white p-6 rounded-sm shadow-sm border border-stone-200 flex justify-between items-start">
              <div className="grow pr-8">
                <div className="flex items-center mb-2">
                  <span className="font-bold text-stone-900 mr-3">{t.name}</span>
                  {t.category && (
                    <span className="bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded-sm uppercase tracking-wide">
                      {t.category}
                    </span>
                  )}
                </div>
                <p className="text-stone-600 text-sm italic">&quot;{t.text}&quot;</p>
                {t.role && <p className="text-stone-400 text-xs mt-2">{t.role}</p>}
              </div>
              <div className="flex space-x-2 shrink-0">
                <button onClick={() => onEdit(t)} className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => onDelete(t.id)} className="text-red-400 hover:text-red-600 p-1 cursor-pointer">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
