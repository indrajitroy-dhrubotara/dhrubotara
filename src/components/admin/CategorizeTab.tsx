"use client";

import { useState } from 'react';
import { type Product, type ProductCategory } from '@/lib/types';
import { AdminThumb } from './AdminThumb';

const CAT_BUTTONS: { id: ProductCategory; label: string; color: string; activeColor: string }[] = [
  { id: 'condiments', label: 'Pickles', color: 'border-amber-300 text-amber-800 hover:bg-amber-50', activeColor: 'bg-amber-600 border-amber-600 text-white' },
  { id: 'herbal', label: 'Herbal', color: 'border-emerald-300 text-emerald-800 hover:bg-emerald-50', activeColor: 'bg-emerald-700 border-emerald-700 text-white' },
  { id: 'rice-other', label: 'Rice', color: 'border-stone-300 text-stone-600 hover:bg-stone-50', activeColor: 'bg-stone-600 border-stone-600 text-white' },
];

interface CategorizeTabProps {
  products: Product[];
  loading: boolean;
  onAssign: (product: Product, category: ProductCategory | undefined) => Promise<void>;
}

export function CategorizeTab({ products, loading, onAssign }: CategorizeTabProps) {
  const [savingCategoryFor, setSavingCategoryFor] = useState<string | null>(null);

  const handleAssign = async (product: Product, category: ProductCategory | undefined) => {
    setSavingCategoryFor(product.id);
    try {
      await onAssign(product, category);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Failed to update category.\n\n${msg}`);
    } finally {
      setSavingCategoryFor(null);
    }
  };

  const uncategorized = products.filter((p) => !p.productCategory).length;

  return (
    <>
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-emerald-950">Categorize Products</h2>
        <p className="text-stone-500 text-sm mt-1">
          Click a category button to instantly assign a product. Changes save automatically.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-500">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-stone-400 font-serif italic">No products found.</div>
      ) : (
        <>
          {uncategorized > 0 ? (
            <div className="mb-5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-sm text-sm text-amber-800">
              <strong>{uncategorized}</strong> product{uncategorized !== 1 ? 's' : ''} still uncategorized.
            </div>
          ) : (
            <div className="mb-5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-sm text-sm text-emerald-800">
              All products are categorized.
            </div>
          )}

          <div className="space-y-2">
            {products.map((product) => {
              const isSaving = savingCategoryFor === product.id;
              const current = product.productCategory;

              return (
                <div
                  key={product.id}
                  className={`flex items-center gap-4 bg-white border rounded-sm px-4 py-3 transition-opacity ${isSaving ? 'opacity-50' : ''} ${!current ? 'border-amber-200' : 'border-stone-200'}`}
                >
                  <AdminThumb src={product.image} alt="" size={40} />
                  <span className="flex-1 text-sm font-medium text-stone-800 truncate min-w-0">
                    {product.name}
                  </span>
                  <div className="flex gap-2 shrink-0">
                    {CAT_BUTTONS.map((btn) => (
                      <button
                        key={btn.id}
                        disabled={isSaving}
                        onClick={() => handleAssign(product, current === btn.id ? undefined : btn.id)}
                        className={`px-3 py-1 text-xs font-medium border rounded-sm transition-all cursor-pointer disabled:cursor-not-allowed ${
                          current === btn.id ? btn.activeColor : btn.color
                        }`}
                      >
                        {current === btn.id && !isSaving ? '✓ ' : ''}{btn.label}
                      </button>
                    ))}
                  </div>
                  {isSaving && (
                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
