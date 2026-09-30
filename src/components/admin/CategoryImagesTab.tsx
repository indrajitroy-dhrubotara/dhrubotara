"use client";

import { useRef, useState, type ChangeEvent, type RefObject } from 'react';
import Image from 'next/image';
import { ImageIcon, Upload } from 'lucide-react';
import { type ProductCategory } from '@/lib/types';
import { uploadToStorage } from '@/lib/uploadToStorage';
import { trackEvent } from '@/lib/analytics';

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'condiments', label: 'Pickles & Condiments' },
  { id: 'herbal', label: 'Herbal Medicines' },
  { id: 'rice-other', label: 'Rice & Other Products' },
];

interface CategoryImagesTabProps {
  getImage: (id: ProductCategory) => string | undefined;
  saveImage: (id: ProductCategory, imageUrl: string) => Promise<void>;
}

export function CategoryImagesTab({ getImage, saveImage }: CategoryImagesTabProps) {
  const condimentsRef = useRef<HTMLInputElement>(null);
  const herbalRef = useRef<HTMLInputElement>(null);
  const riceOtherRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<ProductCategory | null>(null);

  const fileRefs: Record<ProductCategory, RefObject<HTMLInputElement | null>> = {
    condiments: condimentsRef,
    herbal: herbalRef,
    'rice-other': riceOtherRef,
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>, catId: ProductCategory) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(catId);
    try {
      const url = await uploadToStorage('categories', file);
      await saveImage(catId, url);
      trackEvent('admin_action', { action: 'update_category_image', category: catId });
    } catch (err) {
      console.error('Category image upload failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Upload failed.\n\n${msg}`);
    } finally {
      setUploading(null);
      e.target.value = '';
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-serif text-2xl text-emerald-950">Category Images</h2>
          <p className="text-stone-500 text-sm mt-1">Upload a photo for each category card shown on the homepage.</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const existingImage = getImage(cat.id);
          const isUploading = uploading === cat.id;

          return (
            <div key={cat.id} className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-sm">
              <div className="relative aspect-[4/3] bg-stone-100">
                {existingImage ? (
                  <Image
                    src={existingImage}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
                    <ImageIcon size={32} className="mb-2 opacity-40" />
                    <span className="text-xs font-sans tracking-wide">No image yet</span>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="font-serif text-emerald-950 text-sm font-medium mb-3">{cat.label}</p>
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileRefs[cat.id].current?.click()}
                  className="w-full flex items-center justify-center gap-2 border border-stone-300 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:border-emerald-700 hover:text-emerald-800 transition-all rounded-sm disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  <Upload size={15} />
                  {existingImage ? 'Replace Image' : 'Upload Image'}
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRefs[cat.id]}
                  className="hidden"
                  onChange={(e) => handleUpload(e, cat.id)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
