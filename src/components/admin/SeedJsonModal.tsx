"use client";

import { useState } from 'react';
import { X } from 'lucide-react';

interface SeedJsonModalProps {
  isSaving: boolean;
  onClose: () => void;
  onSeed: (items: unknown[]) => Promise<void>;
}

export function SeedJsonModal({ isSaving, onClose, onSeed }: SeedJsonModalProps) {
  const [seedJson, setSeedJson] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: unknown = JSON.parse(seedJson);
      if (!Array.isArray(data)) throw new Error('JSON must be an array of products');
      await onSeed(data);
    } catch (err) {
      console.error(err);
      alert('Failed to seed data. Check console for details. Ensure JSON is valid.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-100">
          <h2 className="text-xl font-serif text-emerald-950">Seed Database</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 cursor-pointer">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Paste JSON Array (products)
            </label>
            <p className="text-xs text-stone-500 mb-2">
              This will upsert products based on ID. Existing products with same ID will be updated.
            </p>
            <textarea
              rows={10}
              value={seedJson}
              onChange={(e) => setSeedJson(e.target.value)}
              className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500 font-mono text-xs"
              placeholder='[{"id": "1", "name": "..."}]'
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-800 disabled:opacity-50 cursor-pointer active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !seedJson}
              className="px-6 py-2 bg-emerald-900 text-white rounded-sm hover:bg-emerald-800 shadow-sm flex items-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer active:scale-95 transition-all"
            >
              {isSaving ? 'Seeding...' : 'Seed Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
