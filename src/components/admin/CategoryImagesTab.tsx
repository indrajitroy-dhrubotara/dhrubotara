"use client";

import { useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { ImageIcon, Upload } from 'lucide-react';
import { type ProductCategory } from '@/lib/types';
import { PRODUCT_CATEGORY_IDS, PRODUCT_CATEGORY_LABELS } from '@/lib/productCategory';
import { uploadToStorage } from '@/lib/uploadToStorage';
import { trackEvent } from '@/lib/analytics';

interface CategoryImagesTabProps {
  getImage: (id: ProductCategory) => string | undefined;
  saveImage: (id: ProductCategory, imageUrl: string) => Promise<void>;
}

export function CategoryImagesTab({ getImage, saveImage }: CategoryImagesTabProps) {
  const fileRefs = useRef<Partial<Record<ProductCategory, HTMLInputElement | null>>>({});
  const [uploading, setUploading] = useState<ProductCategory | null>(null);

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
          <p className="text-stone-500 text-sm mt-1">
            Upload a photo for each category card on the homepage, and for the Art Accessories page hero.
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCT_CATEGORY_IDS.map((id) => {
          const existingImage = getImage(id);
          const isUploading = uploading === id;
          const label = PRODUCT_CATEGORY_LABELS[id];

          return (
            <div key={id} className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-sm">
              <div className="relative aspect-[4/3] bg-stone-100">
                {existingImage ? (
                  <Image
                    src={existingImage}
                    alt={label}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
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
                <p className="font-serif text-emerald-950 text-sm font-medium mb-3">{label}</p>
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileRefs.current[id]?.click()}
                  className="w-full flex items-center justify-center gap-2 border border-stone-300 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:border-emerald-700 hover:text-emerald-800 transition-all rounded-sm disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  <Upload size={15} />
                  {existingImage ? 'Replace Image' : 'Upload Image'}
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => {
                    fileRefs.current[id] = el;
                  }}
                  className="hidden"
                  onChange={(e) => handleUpload(e, id)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
