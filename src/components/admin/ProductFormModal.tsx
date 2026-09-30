"use client";

import { useRef, useState } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { type Product, type ProductCategory } from '@/lib/types';
import { uploadToStorage } from '@/lib/uploadToStorage';
import { AdminThumb } from './AdminThumb';

interface ProductFormModalProps {
  product: Product;
  isSaving: boolean;
  onChange: (product: Product) => void;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function ProductFormModal({
  product,
  isSaving,
  onChange,
  onSave,
  onClose,
}: ProductFormModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToStorage('products', file);
      onChange({ ...product, image: url });
    } catch (err) {
      console.error('Upload failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Upload failed.\n\n${msg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.image) {
      alert('Please upload a product image before saving.');
      return;
    }
    onSave(e);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-100">
          <h2 className="text-xl font-serif text-emerald-950">
            {product.id.startsWith('new-') ? 'New Product' : 'Edit Product'}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 cursor-pointer">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={product.name}
                onChange={(e) => onChange({ ...product, name: e.target.value })}
                className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-stone-700 mb-1">Tag</label>
              <input
                type="text"
                value={product.tag}
                onChange={(e) => onChange({ ...product, tag: e.target.value })}
                className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-stone-700 mb-1">Price</label>
              <input
                type="text"
                value={product.price || ''}
                onChange={(e) => onChange({ ...product, price: e.target.value })}
                className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Rs. 350"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-stone-700 mb-1">Weight</label>
              <input
                type="text"
                value={product.weight || ''}
                onChange={(e) => onChange({ ...product, weight: e.target.value || undefined })}
                className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="225 gms"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Sort Priority</label>
            <input
              type="number"
              value={product.sortPriority ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                const num = val === '' ? undefined : parseInt(val);
                onChange({ ...product, sortPriority: num });
              }}
              className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Lower number = appears first"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Product Category</label>
            <select
              value={product.productCategory ?? ''}
              onChange={(e) =>
                onChange({
                  ...product,
                  productCategory: (e.target.value as ProductCategory) || undefined,
                })
              }
              className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white text-stone-700"
            >
              <option value="">— Uncategorized —</option>
              <option value="condiments">Pickles &amp; Condiments</option>
              <option value="herbal">Herbal Medicines</option>
              <option value="rice-other">Rice &amp; Other Products</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Image</label>
            <div className="flex items-center space-x-4">
              <AdminThumb src={product.image} alt="Preview" size={64} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-stone-300 rounded-sm text-sm font-medium text-stone-700 hover:bg-stone-50 flex items-center cursor-pointer"
              >
                <Upload size={16} className="mr-2" />
                {uploading ? 'Uploading...' : product.image ? 'Change Image' : 'Upload Image'}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Short Description</label>
            <textarea
              rows={2}
              value={product.description}
              onChange={(e) => onChange({ ...product, description: e.target.value })}
              className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Long Story</label>
            <textarea
              rows={4}
              value={product.longDescription}
              onChange={(e) => onChange({ ...product, longDescription: e.target.value })}
              className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
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
