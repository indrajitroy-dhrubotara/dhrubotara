"use client";

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Gift, Plus, Trash2, Upload } from 'lucide-react';
import { type HamperImage } from '@/lib/types';
import { uploadToStorage } from '@/lib/uploadToStorage';
import { trackEvent } from '@/lib/analytics';

interface HamperImagesTabProps {
  images: HamperImage[];
  loading: boolean;
  addImage: (imageUrl: string, sortPriority?: number) => Promise<string>;
  updateImage: (id: string, imageUrl: string, sortPriority?: number) => Promise<void>;
  removeImage: (id: string) => Promise<void>;
}

export function HamperImagesTab({
  images,
  loading,
  addImage,
  updateImage,
  removeImage,
}: HamperImagesTabProps) {
  const newFileRef = useRef<HTMLInputElement>(null);
  const replaceFileRef = useRef<HTMLInputElement>(null);
  const [uploadingNew, setUploadingNew] = useState(false);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingNew(true);
    try {
      const url = await uploadToStorage('hamper', file);
      await addImage(url);
      trackEvent('admin_action', { action: 'add_hamper_image' });
    } catch (err) {
      console.error('Hamper image upload failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Upload failed.\n\n${msg}`);
    } finally {
      setUploadingNew(false);
      e.target.value = '';
    }
  };

  const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = replacingId;
    if (!file || !targetId) {
      e.target.value = '';
      return;
    }
    try {
      const existing = images.find((img) => img.id === targetId);
      const url = await uploadToStorage('hamper', file);
      await updateImage(targetId, url, existing?.sortPriority);
      trackEvent('admin_action', { action: 'replace_hamper_image', hamper_image_id: targetId });
    } catch (err) {
      console.error('Hamper image replace failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Upload failed.\n\n${msg}`);
    } finally {
      setReplacingId(null);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this hamper image?')) return;
    setDeletingId(id);
    try {
      await removeImage(id);
      trackEvent('admin_action', { action: 'delete_hamper_image', hamper_image_id: id });
    } catch (err) {
      console.error('Hamper image delete failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Delete failed.\n\n${msg}`);
    } finally {
      setDeletingId(null);
    }
  };

  const triggerReplace = (id: string) => {
    setReplacingId(id);
    window.setTimeout(() => replaceFileRef.current?.click(), 0);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-serif text-2xl text-emerald-950">Customize Your Hamper — Pictures</h2>
          <p className="text-stone-500 text-sm mt-1">
            The homepage shows the first <strong>4</strong> images here in a 2×2 grid. Empty slots fall back to the default placeholder.
          </p>
        </div>
        <button
          type="button"
          disabled={uploadingNew}
          onClick={() => newFileRef.current?.click()}
          className="bg-emerald-800 text-white px-4 py-2 rounded-sm flex items-center hover:bg-emerald-700 transition-all shadow-sm text-sm cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploadingNew ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Uploading…
            </>
          ) : (
            <>
              <Plus size={16} className="mr-2" /> Add Image
            </>
          )}
        </button>
        <input type="file" accept="image/*" ref={newFileRef} className="hidden" onChange={handleAdd} />
        <input type="file" accept="image/*" ref={replaceFileRef} className="hidden" onChange={handleReplace} />
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-500">Loading hamper images…</div>
      ) : images.length === 0 ? (
        <div className="bg-white border border-dashed border-stone-300 rounded-sm py-16 text-center">
          <Gift size={40} className="mx-auto text-stone-300 mb-3" />
          <p className="font-serif text-lg text-emerald-950 mb-1">No hamper images yet</p>
          <p className="text-stone-500 text-sm mb-5">
            Add at least one image to replace the default placeholder shown on the homepage.
          </p>
          <button
            type="button"
            disabled={uploadingNew}
            onClick={() => newFileRef.current?.click()}
            className="inline-flex items-center bg-emerald-800 text-white px-4 py-2 rounded-sm hover:bg-emerald-700 transition-all text-sm cursor-pointer active:scale-95 disabled:opacity-60"
          >
            <Upload size={15} className="mr-2" />
            {uploadingNew ? 'Uploading…' : 'Upload First Image'}
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, idx) => {
            const isReplacing = replacingId === img.id;
            const isDeleting = deletingId === img.id;
            const busy = isReplacing || isDeleting;
            const isVisible = idx < 4;
            return (
              <div
                key={img.id}
                className={`bg-white border rounded-sm overflow-hidden shadow-sm ${
                  isVisible ? 'border-emerald-300' : 'border-stone-200 opacity-80'
                }`}
              >
                <div className="relative aspect-square bg-stone-100">
                  <Image
                    src={img.image}
                    alt="Hamper"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <span
                    className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase rounded-sm ${
                      isVisible ? 'bg-emerald-700 text-white' : 'bg-stone-700/80 text-white'
                    }`}
                  >
                    {isVisible ? `Slot ${idx + 1}` : 'Hidden'}
                  </span>
                  {busy && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900" />
                    </div>
                  )}
                </div>
                <div className="p-4 flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => triggerReplace(img.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 border border-stone-300 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:border-emerald-700 hover:text-emerald-800 transition-all rounded-sm disabled:opacity-50 cursor-pointer active:scale-95"
                  >
                    <Upload size={15} /> Replace
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleDelete(img.id)}
                    aria-label="Delete hamper image"
                    className="inline-flex items-center justify-center px-3 py-2 border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 transition-all rounded-sm disabled:opacity-50 cursor-pointer active:scale-95"
                  >
                    <Trash2 size={15} />
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
