"use client";

import Image from 'next/image';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { type Testimonial } from '@/lib/types';

interface ReorderTestimonialsTabProps {
  testimonials: Testimonial[];
  loading: boolean;
  reordering: boolean;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

export function ReorderTestimonialsTab({
  testimonials,
  loading,
  reordering,
  onMove,
}: ReorderTestimonialsTabProps) {
  return (
    <>
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-emerald-950">Reorder Testimonials</h2>
        <p className="text-stone-500 text-sm mt-1">
          Use the arrows to set the order in which reviews appear on the homepage. The first row is shown first.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-500">Loading reviews…</div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20 text-stone-400 font-serif italic">No testimonials yet.</div>
      ) : (
        <div className="space-y-2">
          {testimonials.map((t, index) => {
            const isFirst = index === 0;
            const isLast = index === testimonials.length - 1;
            return (
              <div
                key={t.id}
                className={`flex items-center gap-3 bg-white border border-stone-200 rounded-sm px-4 py-3 transition-opacity ${
                  reordering ? 'opacity-60' : ''
                }`}
              >
                <span className="font-mono text-stone-400 text-sm w-6 text-right shrink-0">
                  {index + 1}
                </span>

                <div className="w-10 h-10 rounded-full bg-emerald-900 text-stone-50 flex items-center justify-center font-serif text-sm shrink-0 overflow-hidden relative">
                  {t.image ? (
                    <Image src={t.image} alt={t.name} fill sizes="40px" className="object-cover" />
                  ) : (
                    t.name.charAt(0)
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">{t.name}</p>
                  <p className="text-xs text-stone-500 italic truncate">&quot;{t.text}&quot;</p>
                </div>

                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={reordering || isFirst}
                    onClick={() => onMove(index, 'up')}
                    aria-label={`Move ${t.name} up`}
                    className="p-1 border border-stone-200 rounded-sm text-stone-600 hover:bg-stone-50 hover:border-emerald-700 hover:text-emerald-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={reordering || isLast}
                    onClick={() => onMove(index, 'down')}
                    aria-label={`Move ${t.name} down`}
                    className="p-1 border border-stone-200 rounded-sm text-stone-600 hover:bg-stone-50 hover:border-emerald-700 hover:text-emerald-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
