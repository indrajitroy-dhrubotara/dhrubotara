"use client";

import Image from 'next/image';
import { Edit2, ImageIcon, Plus, Trash2 } from 'lucide-react';
import { type Product } from '@/lib/types';

interface AccessoriesTabProps {
  products: Product[];
  loading: boolean;
  onCreate: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function AccessoriesTab({
  products,
  loading,
  onCreate,
  onEdit,
  onDelete,
}: AccessoriesTabProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="font-serif text-2xl text-emerald-950">Art Accessories</h2>
          <p className="text-stone-500 text-sm mt-1">
            Add a photo, description, and price for each hand-painted bag, tray, pot, or other piece. These appear on the Accessories page.
          </p>
        </div>
        <button
          onClick={onCreate}
          className="bg-emerald-800 text-white px-4 py-2 rounded-sm flex items-center justify-center hover:bg-emerald-700 transition-all shadow-sm text-sm cursor-pointer active:scale-95 shrink-0"
        >
          <Plus size={16} className="mr-2" /> Add Accessory
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-500">Loading accessories...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-stone-200 rounded-sm bg-white">
          <p className="font-serif italic text-lg text-stone-400">No accessories yet.</p>
          <p className="font-sans text-sm text-stone-400 mt-2">
            Add a piece with a picture, description, and price to show it on the website.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-stone-100">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-serif text-lg text-emerald-950 leading-tight">{product.name}</h3>
                  {product.price ? (
                    <span className="font-sans text-sm text-emerald-800 whitespace-nowrap pt-0.5">
                      {product.price}
                    </span>
                  ) : null}
                </div>
                <p className="font-sans text-sm text-stone-500 leading-relaxed line-clamp-3 min-h-[3.75rem]">
                  {product.description || 'No description yet.'}
                </p>
                <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="text-emerald-700 hover:text-emerald-900 cursor-pointer p-1"
                    aria-label={`Edit ${product.name}`}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product.id)}
                    className="text-red-400 hover:text-red-600 cursor-pointer p-1"
                    aria-label={`Delete ${product.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
