"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/lib/useProducts';
import { useTestimonials } from '@/lib/useTestimonials';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, Plus, Edit2, Trash2, Save, X, Upload, MessageSquare, Package, FileJson } from 'lucide-react';
import { type Product, type Testimonial, type ProductCategory } from '@/lib/types';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { trackEvent } from '@/lib/analytics';

export default function AdminDashboard() {
  const { user, signOut, isAdmin, loading: authLoading } = useAuth();
  const { products, loading: pLoading, saveProduct, deleteProduct } = useProducts();
  const { testimonials, loading: tLoading, saveTestimonial, deleteTestimonial } = useTestimonials();
  
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'testimonials'>('products');
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSeedOpen, setIsSeedOpen] = useState(false);
  const [seedJson, setSeedJson] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user || !isAdmin) {
      router.push('/admin');
    }
  }, [user, isAdmin, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    trackEvent('admin_logout');
    await signOut();
    router.push('/admin');
  };

  // --- Product Handlers ---
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCreateProduct = () => {
    setEditingProduct({
      id: `new-${Date.now()}`,
      name: '',
      description: '',
      longDescription: '',
      image: 'https://picsum.photos/seed/new/800/800',
      tag: '',
      price: '',
      features: [],
      sortPriority: undefined,
      productCategory: undefined,
    });
    setIsFormOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setIsSaving(true);
      try {
        await saveProduct(editingProduct);
        trackEvent('admin_action', {
          action: editingProduct.id.startsWith('new-') ? 'create_product' : 'update_product',
          product_id: editingProduct.id,
          product_name: editingProduct.name,
        });
        setIsFormOpen(false);
        setEditingProduct(null);
      } catch (err) {
        console.error(err);
        alert("Failed to save product.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      trackEvent('admin_action', { action: 'delete_product', product_id: id });
    }
  };

  const handleSeedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        const data = JSON.parse(seedJson);
        if (!Array.isArray(data)) throw new Error("JSON must be an array of products");
        
        // Process sequentially to avoid overwhelming rate limits if any
        let count = 0;
        for (const item of data) {
            await saveProduct(item);
            count++;
        }
        alert(`Successfully seeded ${count} products.`);
        setIsSeedOpen(false);
        setSeedJson('');
    } catch (err) {
        console.error(err);
        alert("Failed to seed data. Check console for details. Ensure JSON is valid.");
    } finally {
        setIsSaving(false);
    }
  };

  // --- Testimonial Handlers ---
  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsFormOpen(true);
  };

  const handleCreateTestimonial = () => {
    setEditingTestimonial({
      id: `new-t-${Date.now()}`,
      name: '',
      text: '',
      category: '',
      role: ''
    });
    setIsFormOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTestimonial) {
      setIsSaving(true);
      try {
        await saveTestimonial(editingTestimonial);
        trackEvent('admin_action', {
          action: editingTestimonial.id.startsWith('new-') ? 'create_testimonial' : 'update_testimonial',
          testimonial_id: editingTestimonial.id,
          reviewer_name: editingTestimonial.name,
        });
        setIsFormOpen(false);
        setEditingTestimonial(null);
      } catch (err) {
        console.error(err);
        alert("Failed to save testimonial.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm("Delete this testimonial?")) {
      await deleteTestimonial(id);
      trackEvent('admin_action', { action: 'delete_testimonial', testimonial_id: id });
    }
  };
  
  // --- Common ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    setUploading(true);
    try {
        if (storage) {
            const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setEditingProduct({ ...editingProduct, image: url });
        }
    } catch (err) {
        console.error("Upload failed", err);
        alert("Upload failed.");
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Admin Header */}
      <header className="bg-emerald-950 text-stone-100 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <span className="font-serif text-xl tracking-wider">dhrubotara <span className="text-emerald-400 text-sm font-sans tracking-normal ml-2">Admin</span></span>
          <div className="flex items-center space-x-4">
             <span className="text-xs text-stone-400 hidden sm:inline">
               {user?.phoneNumber || "Demo User"}
             </span>
             <button onClick={handleLogout} className="flex items-center text-sm hover:text-white transition-all cursor-pointer active:scale-95">
               <LogOut size={16} className="mr-2" /> Logout
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tabs */}
        <div className="flex space-x-8 border-b border-stone-200 mb-8">
           <button
             onClick={() => setActiveTab('products')}
             className={`pb-4 text-sm font-medium flex items-center cursor-pointer transition-all active:scale-95 ${activeTab === 'products' ? 'border-b-2 border-emerald-900 text-emerald-900' : 'text-stone-500 hover:text-stone-700'}`}
           >
             <Package size={18} className="mr-2" /> Products
           </button>
           <button
             onClick={() => setActiveTab('testimonials')}
             className={`pb-4 text-sm font-medium flex items-center cursor-pointer transition-all active:scale-95 ${activeTab === 'testimonials' ? 'border-b-2 border-emerald-900 text-emerald-900' : 'text-stone-500 hover:text-stone-700'}`}
           >
             <MessageSquare size={18} className="mr-2" /> Testimonials
           </button>
        </div>

        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl text-emerald-950">Catalog</h2>
              <div className="flex space-x-3">
                  <button 
                    onClick={() => setIsSeedOpen(true)}
                    className="bg-stone-200 text-stone-700 px-4 py-2 rounded-sm flex items-center hover:bg-stone-300 transition-all shadow-sm text-sm cursor-pointer active:scale-95"
                  >
                    <FileJson size={16} className="mr-2" /> Seed JSON
                  </button>
                  <button 
                    onClick={handleCreateProduct}
                    className="bg-emerald-800 text-white px-4 py-2 rounded-sm flex items-center hover:bg-emerald-700 transition-all shadow-sm text-sm cursor-pointer active:scale-95"
                  >
                    <Plus size={16} className="mr-2" /> Add Product
                  </button>
              </div>
            </div>

            {pLoading ? (
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
                            <div className="h-10 w-10 shrink-0 relative">
                              <Image className="rounded-sm object-cover bg-stone-200" src={product.image} alt="" fill sizes="40px" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-stone-900">{product.name}</div>
                              <div className="text-xs text-emerald-600">{product.price}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 hidden sm:table-cell">
                          {product.productCategory ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                              {product.productCategory === 'condiments' ? 'Condiments' : product.productCategory === 'herbal' ? 'Herbal' : 'Rice & Other'}
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
                          <button onClick={() => handleEditProduct(product)} className="text-emerald-700 hover:text-emerald-900 mr-4 cursor-pointer">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="text-red-400 hover:text-red-600 cursor-pointer">
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
        )}

        {/* --- TESTIMONIALS TAB --- */}
        {activeTab === 'testimonials' && (
          <>
             <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl text-emerald-950">Testimonials</h2>
              <button 
                onClick={handleCreateTestimonial}
                className="bg-emerald-800 text-white px-4 py-2 rounded-sm flex items-center hover:bg-emerald-700 transition-all shadow-sm text-sm cursor-pointer active:scale-95"
              >
                <Plus size={16} className="mr-2" /> Add Review
              </button>
            </div>

            {tLoading ? (
              <div className="text-center py-20 text-stone-500">Loading reviews...</div>
            ) : (
              <div className="grid gap-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-white p-6 rounded-sm shadow-sm border border-stone-200 flex justify-between items-start">
                    <div className="grow pr-8">
                       <div className="flex items-center mb-2">
                          <span className="font-bold text-stone-900 mr-3">{t.name}</span>
                          {t.category && <span className="bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded-sm uppercase tracking-wide">{t.category}</span>}
                       </div>
                       <p className="text-stone-600 text-sm italic">&quot;{t.text}&quot;</p>
                       {t.role && <p className="text-stone-400 text-xs mt-2">{t.role}</p>}
                    </div>
                    <div className="flex space-x-2 shrink-0">
                       <button onClick={() => handleEditTestimonial(t)} className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer">
                          <Edit2 size={18} />
                       </button>
                       <button onClick={() => handleDeleteTestimonial(t.id)} className="text-red-400 hover:text-red-600 p-1 cursor-pointer">
                          <Trash2 size={18} />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* --- MODALS --- */}
      {isSeedOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-stone-100">
                    <h2 className="text-xl font-serif text-emerald-950">Seed Database</h2>
                    <button onClick={() => { setIsSeedOpen(false); setSeedJson(''); }} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSeedSubmit} className="p-6">
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
                            onClick={() => { setIsSeedOpen(false); setSeedJson(''); }}
                            className="px-4 py-2 text-stone-600 hover:text-stone-800 disabled:opacity-50 cursor-pointer active:scale-95 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSaving || !seedJson}
                            className="px-6 py-2 bg-emerald-900 text-white rounded-sm hover:bg-emerald-800 shadow-sm flex items-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer active:scale-95 transition-all"
                        >
                            {isSaving ? "Seeding..." : "Seed Data"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden">
             
             {/* Product Form */}
             {editingProduct && (
               <>
                 <div className="flex justify-between items-center px-6 py-4 border-b border-stone-100">
                    <h2 className="text-xl font-serif text-emerald-950">
                      {editingProduct.id.startsWith('new-') ? 'New Product' : 'Edit Product'}
                    </h2>
                    <button onClick={() => { setIsFormOpen(false); setEditingProduct(null); }} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                       <X size={24} />
                    </button>
                 </div>
                 <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="col-span-2 sm:col-span-1">
                          <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                          <input 
                            type="text" 
                            required
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                            className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
                          />
                       </div>
                       <div className="col-span-2 sm:col-span-1">
                          <label className="block text-sm font-medium text-stone-700 mb-1">Tag</label>
                          <input 
                            type="text" 
                            value={editingProduct.tag}
                            onChange={(e) => setEditingProduct({...editingProduct, tag: e.target.value})}
                            className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
                          />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="col-span-2 sm:col-span-1">
                          <label className="block text-sm font-medium text-stone-700 mb-1">Price</label>
                          <input 
                            type="text" 
                            value={editingProduct.price || ''}
                            onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                            className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
                          />
                       </div>
                       <div className="col-span-2 sm:col-span-1">
                          <label className="block text-sm font-medium text-stone-700 mb-1">Sort Priority</label>
                          <input 
                            type="number" 
                            value={editingProduct.sortPriority ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              // Allow typing 0, but treat empty string as no priority
                              const num = val === '' ? undefined : parseInt(val);
                              setEditingProduct({...editingProduct, sortPriority: num});
                            }}
                            className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Higher = appears first"
                          />
                       </div>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-stone-700 mb-1">Product Category</label>
                       <select
                         value={editingProduct.productCategory ?? ''}
                         onChange={(e) => setEditingProduct({
                           ...editingProduct,
                           productCategory: (e.target.value as ProductCategory) || undefined
                         })}
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
                            <div className="relative h-16 w-16">
                                <Image src={editingProduct.image} alt="Preview" className="object-cover rounded-sm bg-stone-100" fill sizes="64px" />
                            </div>
                            <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 border border-stone-300 rounded-sm text-sm font-medium text-stone-700 hover:bg-stone-50 flex items-center cursor-pointer"
                            >
                                <Upload size={16} className="mr-2" />
                                {uploading ? "Uploading..." : "Change Image"}
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
                         value={editingProduct.description}
                         onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                         className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-stone-700 mb-1">Long Story</label>
                       <textarea 
                         rows={4}
                         value={editingProduct.longDescription}
                         onChange={(e) => setEditingProduct({...editingProduct, longDescription: e.target.value})}
                         className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
                       />
                    </div>
                    <div className="pt-4 border-t border-stone-100 flex justify-end space-x-3">
                       <button 
                         type="button" 
                         disabled={isSaving || uploading}
                         onClick={() => { setIsFormOpen(false); setEditingProduct(null); }} 
                         className="px-4 py-2 text-stone-600 hover:text-stone-800 disabled:opacity-50 cursor-pointer active:scale-95 transition-all"
                       >
                         Cancel
                       </button>
                       <button 
                         type="submit" 
                         disabled={isSaving || uploading}
                         className="px-6 py-2 bg-emerald-900 text-white rounded-sm hover:bg-emerald-800 shadow-sm flex items-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer active:scale-95 transition-all"
                       >
                         {isSaving ? "Saving..." : <><Save size={18} className="mr-2" /> Save</>}
                       </button>
                    </div>
                 </form>
               </>
             )}

             {/* Testimonial Form */}
             {editingTestimonial && (
               <>
                 <div className="flex justify-between items-center px-6 py-4 border-b border-stone-100">
                    <h2 className="text-xl font-serif text-emerald-950">
                      {editingTestimonial.id.startsWith('new-') ? 'New Review' : 'Edit Review'}
                    </h2>
                    <button onClick={() => { setIsFormOpen(false); setEditingTestimonial(null); }} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                       <X size={24} />
                    </button>
                 </div>
                 <form onSubmit={handleSaveTestimonial} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="col-span-2 sm:col-span-1">
                          <label className="block text-sm font-medium text-stone-700 mb-1">Reviewer Name</label>
                          <input 
                            type="text" 
                            required
                            value={editingTestimonial.name}
                            onChange={(e) => setEditingTestimonial({...editingTestimonial, name: e.target.value})}
                            className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
                          />
                       </div>
                       <div className="col-span-2 sm:col-span-1">
                          <label className="block text-sm font-medium text-stone-700 mb-1">Category (e.g. Cough & Cold)</label>
                          <input 
                            type="text" 
                            value={editingTestimonial.category || ''}
                            onChange={(e) => setEditingTestimonial({...editingTestimonial, category: e.target.value})}
                            className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
                          />
                       </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Role/Location</label>
                        <input 
                            type="text" 
                            value={editingTestimonial.role || ''}
                            onChange={(e) => setEditingTestimonial({...editingTestimonial, role: e.target.value})}
                            className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-stone-700 mb-1">Testimonial Text</label>
                       <textarea 
                         rows={4}
                         required
                         value={editingTestimonial.text}
                         onChange={(e) => setEditingTestimonial({...editingTestimonial, text: e.target.value})}
                         className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
                       />
                    </div>
                    <div className="pt-4 border-t border-stone-100 flex justify-end space-x-3">
                       <button 
                         type="button" 
                         disabled={isSaving}
                         onClick={() => { setIsFormOpen(false); setEditingTestimonial(null); }} 
                         className="px-4 py-2 text-stone-600 hover:text-stone-800 disabled:opacity-50 cursor-pointer active:scale-95 transition-all"
                       >
                         Cancel
                       </button>
                       <button 
                         type="submit" 
                         disabled={isSaving}
                         className="px-6 py-2 bg-emerald-900 text-white rounded-sm hover:bg-emerald-800 shadow-sm flex items-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer active:scale-95 transition-all"
                       >
                         {isSaving ? "Saving..." : <><Save size={18} className="mr-2" /> Save</>}
                       </button>
                    </div>
                 </form>
               </>
             )}

          </div>
        </div>
      )}
    </div>
  );
}
