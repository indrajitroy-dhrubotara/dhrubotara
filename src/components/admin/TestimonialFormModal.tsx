"use client";

import { useRef, useState } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { type Testimonial } from '@/lib/types';
import { uploadToStorage } from '@/lib/uploadToStorage';
import { AdminThumb } from './AdminThumb';

interface TestimonialFormModalProps {
  testimonial: Testimonial;
  isSaving: boolean;
  onChange: (testimonial: Testimonial) => void;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function TestimonialFormModal({
  testimonial,
  isSaving,
  onChange,
  onSave,
  onClose,
}: TestimonialFormModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToStorage('testimonials', file);
      onChange({ ...testimonial, image: url });
    } catch (err) {
      console.error('Upload failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Upload failed.\n\n${msg}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-100">
          <h2 className="text-xl font-serif text-emerald-950">
            {testimonial.id.startsWith('new-') ? 'New Review' : 'Edit Review'}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 cursor-pointer">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={onSave} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-stone-700 mb-1">Reviewer Name</label>
              <input
                type="text"
                required
                value={testimonial.name}
                onChange={(e) => onChange({ ...testimonial, name: e.target.value })}
                className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-stone-700 mb-1">Category (e.g. Cough & Cold)</label>
              <input
                type="text"
                value={testimonial.category || ''}
                onChange={(e) => onChange({ ...testimonial, category: e.target.value })}
                className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Role/Location</label>
            <input
              type="text"
              value={testimonial.role || ''}
              onChange={(e) => onChange({ ...testimonial, role: e.target.value })}
              className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Testimonial Text</label>
            <textarea
              rows={4}
              required
              value={testimonial.text}
              onChange={(e) => onChange({ ...testimonial, text: e.target.value })}
              className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Reviewer Photo (optional)</label>
            <div className="flex items-center space-x-4">
              {testimonial.image ? (
                <AdminThumb src={testimonial.image} alt="Preview" size={56} rounded="full" />
              ) : (
                <div className="w-14 h-14 rounded-full overflow-hidden bg-emerald-900 flex items-center justify-center shrink-0">
                  <span className="text-stone-50 font-serif text-xl">
                    {testimonial.name.charAt(0) || '?'}
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 border border-stone-300 rounded-sm text-sm font-medium text-stone-700 hover:bg-stone-50 flex items-center cursor-pointer disabled:opacity-50"
                >
                  <Upload size={15} className="mr-2" />
                  {uploading ? 'Uploading...' : testimonial.image ? 'Change Photo' : 'Upload Photo'}
                </button>
                {testimonial.image && (
                  <button
                    type="button"
                    onClick={() => onChange({ ...testimonial, image: undefined })}
                    className="text-xs text-red-400 hover:text-red-600 text-left cursor-pointer"
                  >
                    Remove photo
                  </button>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>
          <div className="pt-4 border-t border-stone-100 flex justify-end space-x-3">
            <button
              type="button"
              disabled={isSaving || uploading}
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-800 disabled:opacity-50 cursor-pointer active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || uploading}
              className="px-6 py-2 bg-emerald-900 text-white rounded-sm hover:bg-emerald-800 shadow-sm flex items-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer active:scale-95 transition-all"
            >
              {isSaving ? 'Saving...' : <><Save size={18} className="mr-2" /> Save</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
