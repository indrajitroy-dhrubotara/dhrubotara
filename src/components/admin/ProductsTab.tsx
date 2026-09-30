"use client";

import { Edit2, FileJson, Plus, Trash2 } from 'lucide-react';
import { type Product } from '@/lib/types';
import { AdminThumb } from './AdminThumb';

function categoryLabel(category: Product['productCategory']) {
  if (category === 'condiments') return 'Condiments';
  if (category === 'herbal') return 'Herbal';
  if (category === 'rice-other') return 'Rice & Other';
  return null;
}

interface ProductsTabProps {
  products: Product[];
  loading: boolean;
  developerMode: boolean;
  onCreate: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onOpenSeed: () => void;
}

export function ProductsTab({
  products,
  loading,
  developerMode,
  onCreate,
  onEdit,
  onDelete,
  onOpenSeed,
}: ProductsTabProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl text-emerald-950">Catalog</h2>
        <div className="flex space-x-3">
          {developerMode && (
            <button
              onClick={onOpenSeed}
              className="bg-stone-200 text-stone-700 px-4 py-2 rounded-sm flex items-center hover:bg-stone-300 transition-all shadow-sm text-sm cursor-pointer active:scale-95"
            >
              <FileJson size={16} className="mr-2" /> Seed JSON
            </button>
          )}
          <button
            onClick={onCreate}
            className="bg-emerald-800 text-white px-4 py-2 rounded-sm flex items-center hover:bg-emerald-700 transition-all shadow-sm text-sm cursor-pointer active:scale-95"
          >
            <Plus size={16} className="mr-2" /> Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-500">Loading products...</div>
      ) : (
        <div className="bg-white shadow-sm rounded-sm overflow-hidden border border-stone-200">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider hidden sm:table-cell">Tag / Priority</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <AdminThumb src={product.image} alt="" size={40} />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-stone-900">{product.name}</div>
                        <div className="text-xs text-emerald-600">{product.price}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 hidden sm:table-cell">
                    {product.productCategory ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                        {categoryLabel(product.productCategory)}
                      </span>
                    ) : (
                      <span className="text-stone-300 text-xs italic">Uncategorized</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 hidden sm:table-cell">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-stone-100 text-stone-600 mr-2">
                      {product.tag}
                    </span>
                    <span className="font-mono text-stone-400 text-xs">
                      {product.sortPriority ?? '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => onEdit(product)} className="text-emerald-700 hover:text-emerald-900 mr-4 cursor-pointer">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => onDelete(product.id)} className="text-red-400 hover:text-red-600 cursor-pointer">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
