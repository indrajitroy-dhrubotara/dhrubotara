"use client";

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { ImageIcon, Save, Trash2, Upload } from 'lucide-react';
import { ARTIST_IMAGE_SLOTS, type ArtistImageSlot } from '@/lib/types';
import { uploadToStorage } from '@/lib/uploadToStorage';
import { trackEvent } from '@/lib/analytics';

interface ArtistTabProps {
  name: string;
  description: string;
  getImage: (slot: ArtistImageSlot) => string | undefined;
  loading: boolean;
  onSaveProfile: (name: string, description: string) => Promise<void>;
  onSaveImage: (slot: ArtistImageSlot, imageUrl: string) => Promise<void>;
  onRemoveImage: (slot: ArtistImageSlot) => Promise<void>;
}

export function ArtistTab({
  name,
  description,
  getImage,
  loading,
  onSaveProfile,
  onSaveImage,
  onRemoveImage,
}: ArtistTabProps) {
  const fileRefs = useRef<Partial<Record<ArtistImageSlot, HTMLInputElement | null>>>({});
  const [draftName, setDraftName] = useState(name);
  const [draftDescription, setDraftDescription] = useState(description);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<ArtistImageSlot | null>(null);
  const [removingSlot, setRemovingSlot] = useState<ArtistImageSlot | null>(null);

  useEffect(() => {
    setDraftName(name);
    setDraftDescription(description);
  }, [name, description]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await onSaveProfile(draftName, draftDescription);
      trackEvent('admin_action', { action: 'update_artist_about' });
    } catch (err) {
      console.error('Failed to save artist profile', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Failed to save.\n\n${msg}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>, slot: ArtistImageSlot) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSlot(slot);
    try {
      const url = await uploadToStorage('artist', file);
      await onSaveImage(slot, url);
      trackEvent('admin_action', { action: 'update_artist_image', slot });
    } catch (err) {
      console.error('Artist image upload failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Upload failed.\n\n${msg}`);
    } finally {
      setUploadingSlot(null);
      e.target.value = '';
    }
  };

  const handleRemove = async (slot: ArtistImageSlot) => {
    if (!window.confirm('Remove this artist picture?')) return;
    setRemovingSlot(slot);
    try {
      await onRemoveImage(slot);
      trackEvent('admin_action', { action: 'delete_artist_image', slot });
    } catch (err) {
      console.error('Artist image delete failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Delete failed.\n\n${msg}`);
    } finally {
      setRemovingSlot(null);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="font-serif text-2xl text-emerald-950">About the Artist</h2>
        <p className="text-stone-500 text-sm mt-1">
          Write the artist&apos;s story and upload up to four pictures. This appears on the Accessories page.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-500">Loading artist details...</div>
      ) : (
        <div className="space-y-10">
          <div className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm">
            <label className="block text-sm font-medium text-stone-700 mb-1">Artist name</label>
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500 mb-4"
              placeholder="Optional — shown under the heading"
            />
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea
              rows={8}
              value={draftDescription}
              onChange={(e) => setDraftDescription(e.target.value)}
              className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Tell visitors about the artist. Use a blank line to start a new paragraph."
            />
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                disabled={savingProfile}
                onClick={() => void handleSaveProfile()}
                className="px-6 py-2 bg-emerald-900 text-white rounded-sm hover:bg-emerald-800 shadow-sm flex items-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer active:scale-95 transition-all"
              >
                {savingProfile ? (
                  'Saving...'
                ) : (
                  <>
                    <Save size={18} className="mr-2" /> Save Description
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-xl text-emerald-950 mb-1">Artist pictures</h3>
            <p className="text-stone-500 text-sm mb-4">
              Four photos in a grid on the Accessories page. You can fill them in any order.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {ARTIST_IMAGE_SLOTS.map((slot, index) => {
                const existingImage = getImage(slot);
                const isUploading = uploadingSlot === slot;
                const isRemoving = removingSlot === slot;
                const busy = isUploading || isRemoving;

                return (
                  <div key={slot} className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-sm">
                    <div className="relative aspect-square bg-stone-100">
                      {existingImage ? (
                        <Image
                          src={existingImage}
                          alt={`Artist picture ${index + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 25vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
                          <ImageIcon size={32} className="mb-2 opacity-40" />
                          <span className="text-xs font-sans tracking-wide">Picture {index + 1}</span>
                        </div>
                      )}
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
                        onClick={() => fileRefs.current[slot]?.click()}
                        className="flex-1 flex items-center justify-center gap-2 border border-stone-300 px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:border-emerald-700 hover:text-emerald-800 transition-all rounded-sm disabled:opacity-50 cursor-pointer active:scale-95"
                      >
                        <Upload size={15} />
                        {existingImage ? 'Replace' : 'Upload'}
                      </button>
                      {existingImage ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void handleRemove(slot)}
                          aria-label={`Remove artist picture ${index + 1}`}
                          className="inline-flex items-center justify-center px-3 py-2 border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 transition-all rounded-sm disabled:opacity-50 cursor-pointer active:scale-95"
                        >
                          <Trash2 size={15} />
                        </button>
                      ) : null}
                      <input
                        type="file"
                        accept="image/*"
                        ref={(el) => {
                          fileRefs.current[slot] = el;
                        }}
                        className="hidden"
                        onChange={(e) => void handleUpload(e, slot)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
