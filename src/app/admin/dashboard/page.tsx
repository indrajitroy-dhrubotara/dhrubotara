"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/lib/useProducts';
import { useTestimonials } from '@/lib/useTestimonials';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, Plus, Edit2, Trash2, Save, X, Upload, MessageSquare, Package, FileJson, ImageIcon, Tag, Gift, BookOpen } from 'lucide-react';
import { type Product, type Testimonial, type ProductCategory } from '@/lib/types';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { trackEvent } from '@/lib/analytics';
import { useCategoryImages } from '@/lib/useCategoryImages';
import { useHamperImages } from '@/lib/useHamperImages';
import { useStoryImages } from '@/lib/useStoryImages';
import { isFirebaseConfigured } from '@/lib/firebase';

export default function AdminDashboard() {
  const { user, signOut, isAdmin, loading: authLoading } = useAuth();
  const { products, loading: pLoading, saveProduct, deleteProduct } = useProducts();
  const { testimonials, loading: tLoading, saveTestimonial, deleteTestimonial } = useTestimonials();
  const { saveImage, getImage } = useCategoryImages();
  const {
    images: hamperImages,
    loading: hamperLoading,
    addImage: addHamperImage,
    updateImage: updateHamperImage,
    removeImage: removeHamperImage,
  } = useHamperImages();
  const {
    images: storyImages,
    loading: storyLoading,
    addImage: addStoryImage,
    updateImage: updateStoryImage,
    removeImage: removeStoryImage,
  } = useStoryImages();

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'testimonials' | 'categories' | 'categorize' | 'hamper' | 'story'>('products');
  const [savingCategoryFor, setSavingCategoryFor] = useState<string | null>(null);
  const [categoryUploading, setCategoryUploading] = useState<ProductCategory | null>(null);
  const [hamperUploadingNew, setHamperUploadingNew] = useState(false);
  const [hamperReplacingId, setHamperReplacingId] = useState<string | null>(null);
  const [hamperDeletingId, setHamperDeletingId] = useState<string | null>(null);
  const [storyUploadingNew, setStoryUploadingNew] = useState(false);
  const [storyReplacingId, setStoryReplacingId] = useState<string | null>(null);
  const [storyDeletingId, setStoryDeletingId] = useState<string | null>(null);
  const categoryFileRefs = {
    condiments: useRef<HTMLInputElement>(null),
    herbal: useRef<HTMLInputElement>(null),
    'rice-other': useRef<HTMLInputElement>(null),
  } as const;
  const hamperNewFileRef = useRef<HTMLInputElement>(null);
  const hamperReplaceFileRef = useRef<HTMLInputElement>(null);
  const storyNewFileRef = useRef<HTMLInputElement>(null);
  const storyReplaceFileRef = useRef<HTMLInputElement>(null);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSeedOpen, setIsSeedOpen] = useState(false);
  const [seedJson, setSeedJson] = useState('');
  const [uploading, setUploading] = useState(false);
  const [testimonialUploading, setTestimonialUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const testimonialFileInputRef = useRef<HTMLInputElement>(null);

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
      image: `https://picsum.photos/seed/${Date.now()}/800/800`,
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
        const msg = err instanceof Error ? err.message : String(err);
        alert(`Failed to save product.\n\n${msg}`);
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
  
  // --- Category Image Upload ---
  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, catId: ProductCategory) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCategoryUploading(catId);
    try {
      if (storage) {
        const storageRef = ref(storage, `categories/${catId}_${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        await saveImage(catId, url);
        trackEvent('admin_action', { action: 'update_category_image', category: catId });
      }
    } catch (err) {
      console.error('Category image upload failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Upload failed.\n\n${msg}`);
    } finally {
      setCategoryUploading(null);
      e.target.value = '';
    }
  };

  // --- Testimonial Image Upload ---
  const handleTestimonialImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingTestimonial) return;
    setTestimonialUploading(true);
    try {
      if (storage) {
        const storageRef = ref(storage, `testimonials/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setEditingTestimonial({ ...editingTestimonial, image: url });
      }
    } catch (err) {
      console.error("Upload failed", err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Upload failed.\n\n${msg}`);
    } finally {
      setTestimonialUploading(false);
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
        const msg = err instanceof Error ? err.message : String(err);
        alert(`Upload failed.\n\n${msg}`);
    } finally {
        setUploading(false);
    }
  };

  // --- Hamper Image Handlers ---
  const handleAddHamperImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHamperUploadingNew(true);
    try {
      if (storage) {
        const storageRef = ref(storage, `hamper/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        await addHamperImage(url);
        trackEvent('admin_action', { action: 'add_hamper_image' });
      }
    } catch (err) {
      console.error('Hamper image upload failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Upload failed.\n\n${msg}`);
    } finally {
      setHamperUploadingNew(false);
      e.target.value = '';
    }
  };

  const handleReplaceHamperImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = hamperReplacingId;
    if (!file || !targetId) {
      e.target.value = '';
      return;
    }
    try {
      const existing = hamperImages.find((img) => img.id === targetId);
      if (storage) {
        const storageRef = ref(storage, `hamper/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        await updateHamperImage(targetId, url, existing?.sortPriority);
        trackEvent('admin_action', { action: 'replace_hamper_image', hamper_image_id: targetId });
      }
    } catch (err) {
      console.error('Hamper image replace failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Upload failed.\n\n${msg}`);
    } finally {
      setHamperReplacingId(null);
      e.target.value = '';
    }
  };

  const handleDeleteHamperImage = async (id: string) => {
    if (!window.confirm('Remove this hamper image?')) return;
    setHamperDeletingId(id);
    try {
      await removeHamperImage(id);
      trackEvent('admin_action', { action: 'delete_hamper_image', hamper_image_id: id });
    } catch (err) {
      console.error('Hamper image delete failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Delete failed.\n\n${msg}`);
    } finally {
      setHamperDeletingId(null);
    }
  };

  const triggerReplaceHamperImage = (id: string) => {
    setHamperReplacingId(id);
    // Defer click so the ref-bound input picks up the latest target id
    window.setTimeout(() => hamperReplaceFileRef.current?.click(), 0);
  };

  // --- Story Image Handlers ---
  const handleAddStoryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStoryUploadingNew(true);
    try {
      if (storage) {
        const storageRef = ref(storage, `story/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        await addStoryImage(url);
        trackEvent('admin_action', { action: 'add_story_image' });
      }
    } catch (err) {
      console.error('Story image upload failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Upload failed.\n\n${msg}`);
    } finally {
      setStoryUploadingNew(false);
      e.target.value = '';
    }
  };

  const handleReplaceStoryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = storyReplacingId;
    if (!file || !targetId) {
      e.target.value = '';
      return;
    }
    try {
      const existing = storyImages.find((img) => img.id === targetId);
      if (storage) {
        const storageRef = ref(storage, `story/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        await updateStoryImage(targetId, url, existing?.sortPriority);
        trackEvent('admin_action', { action: 'replace_story_image', story_image_id: targetId });
      }
    } catch (err) {
      console.error('Story image replace failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Upload failed.\n\n${msg}`);
    } finally {
      setStoryReplacingId(null);
      e.target.value = '';
    }
  };

  const handleDeleteStoryImage = async (id: string) => {
    if (!window.confirm('Remove this story image?')) return;
    setStoryDeletingId(id);
    try {
      await removeStoryImage(id);
      trackEvent('admin_action', { action: 'delete_story_image', story_image_id: id });
    } catch (err) {
      console.error('Story image delete failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Delete failed.\n\n${msg}`);
    } finally {
      setStoryDeletingId(null);
    }
  };

  const triggerReplaceStoryImage = (id: string) => {
    setStoryReplacingId(id);
    window.setTimeout(() => storyReplaceFileRef.current?.click(), 0);
  };

  // --- Inline category assign ---
  const handleAssignCategory = async (product: Product, category: ProductCategory | undefined) => {
    setSavingCategoryFor(product.id);
    try {
      await saveProduct({ ...product, productCategory: category });
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Failed to update category.\n\n${msg}`);
    } finally {
      setSavingCategoryFor(null);
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
        {!isFirebaseConfigured && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-sm px-5 py-4 text-sm text-red-800">
            <strong className="font-semibold">Firebase not configured.</strong> Saves and uploads will fail until you add your Firebase credentials.{' '}
            Create a <code className="bg-red-100 px-1 rounded">.env.local</code> file with your <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_FIREBASE_*</code> values, then restart the dev server.
          </div>
        )}
        
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
           <button
             onClick={() => setActiveTab('categorize')}
             className={`pb-4 text-sm font-medium flex items-center cursor-pointer transition-all active:scale-95 ${activeTab === 'categorize' ? 'border-b-2 border-emerald-900 text-emerald-900' : 'text-stone-500 hover:text-stone-700'}`}
           >
             <Tag size={18} className="mr-2" /> Categorize
           </button>
           <button
             onClick={() => setActiveTab('categories')}
             className={`pb-4 text-sm font-medium flex items-center cursor-pointer transition-all active:scale-95 ${activeTab === 'categories' ? 'border-b-2 border-emerald-900 text-emerald-900' : 'text-stone-500 hover:text-stone-700'}`}
           >
             <ImageIcon size={18} className="mr-2" /> Category Images
           </button>
           <button
             onClick={() => setActiveTab('hamper')}
             className={`pb-4 text-sm font-medium flex items-center cursor-pointer transition-all active:scale-95 ${activeTab === 'hamper' ? 'border-b-2 border-emerald-900 text-emerald-900' : 'text-stone-500 hover:text-stone-700'}`}
           >
             <Gift size={18} className="mr-2" /> Hamper Images
           </button>
           <button
             onClick={() => setActiveTab('story')}
             className={`pb-4 text-sm font-medium flex items-center cursor-pointer transition-all active:scale-95 ${activeTab === 'story' ? 'border-b-2 border-emerald-900 text-emerald-900' : 'text-stone-500 hover:text-stone-700'}`}
           >
             <BookOpen size={18} className="mr-2" /> Story Images
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

        {/* --- CATEGORIZE TAB --- */}
        {activeTab === 'categorize' && (
          <>
            <div className="mb-6">
              <h2 className="font-serif text-2xl text-emerald-950">Categorize Products</h2>
              <p className="text-stone-500 text-sm mt-1">
                Click a category button to instantly assign a product. Changes save automatically.
              </p>
            </div>

            {pLoading ? (
              <div className="text-center py-20 text-stone-500">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-stone-400 font-serif italic">No products found.</div>
            ) : (
              <>
                {/* Stats bar */}
                {(() => {
                  const uncategorized = products.filter(p => !p.productCategory).length;
                  return uncategorized > 0 ? (
                    <div className="mb-5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-sm text-sm text-amber-800">
                      <strong>{uncategorized}</strong> product{uncategorized !== 1 ? 's' : ''} still uncategorized.
                    </div>
                  ) : (
                    <div className="mb-5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-sm text-sm text-emerald-800">
                      All products are categorized.
                    </div>
                  );
                })()}

                <div className="space-y-2">
                  {products.map((product) => {
                    const isSaving = savingCategoryFor === product.id;
                    const current = product.productCategory;

                    const CAT_BUTTONS: { id: ProductCategory; label: string; color: string; activeColor: string }[] = [
                      { id: 'condiments',  label: 'Pickles',  color: 'border-amber-300 text-amber-800 hover:bg-amber-50',  activeColor: 'bg-amber-600 border-amber-600 text-white' },
                      { id: 'herbal',      label: 'Herbal',   color: 'border-emerald-300 text-emerald-800 hover:bg-emerald-50', activeColor: 'bg-emerald-700 border-emerald-700 text-white' },
                      { id: 'rice-other',  label: 'Rice',     color: 'border-stone-300 text-stone-600 hover:bg-stone-50',   activeColor: 'bg-stone-600 border-stone-600 text-white' },
                    ];

                    return (
                      <div
                        key={product.id}
                        className={`flex items-center gap-4 bg-white border rounded-sm px-4 py-3 transition-opacity ${isSaving ? 'opacity-50' : ''} ${!current ? 'border-amber-200' : 'border-stone-200'}`}
                      >
                        {/* Thumbnail */}
                        <div className="relative h-10 w-10 flex-shrink-0 rounded-sm overflow-hidden bg-stone-100">
                          <Image src={product.image} alt="" fill sizes="40px" className="object-cover" />
                        </div>

                        {/* Name */}
                        <span className="flex-1 text-sm font-medium text-stone-800 truncate min-w-0">
                          {product.name}
                        </span>

                        {/* Category buttons */}
                        <div className="flex gap-2 flex-shrink-0">
                          {CAT_BUTTONS.map((btn) => (
                            <button
                              key={btn.id}
                              disabled={isSaving}
                              onClick={() => handleAssignCategory(product, current === btn.id ? undefined : btn.id)}
                              className={`px-3 py-1 text-xs font-medium border rounded-sm transition-all cursor-pointer disabled:cursor-not-allowed ${
                                current === btn.id ? btn.activeColor : btn.color
                              }`}
                            >
                              {current === btn.id && !isSaving ? '✓ ' : ''}{btn.label}
                            </button>
                          ))}
                        </div>

                        {isSaving && (
                          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* --- CATEGORIES TAB --- */}
        {activeTab === 'categories' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-serif text-2xl text-emerald-950">Category Images</h2>
                <p className="text-stone-500 text-sm mt-1">Upload a photo for each category card shown on the homepage.</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {(
                [
                  { id: 'condiments' as ProductCategory, label: 'Pickles & Condiments' },
                  { id: 'herbal' as ProductCategory, label: 'Herbal Medicines' },
                  { id: 'rice-other' as ProductCategory, label: 'Rice & Other Products' },
                ] as const
              ).map((cat) => {
                const existingImage = getImage(cat.id);
                const isUploading = categoryUploading === cat.id;

                return (
                  <div key={cat.id} className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-sm">
                    {/* Image preview */}
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

                    {/* Card footer */}
                    <div className="p-4">
                      <p className="font-serif text-emerald-950 text-sm font-medium mb-3">{cat.label}</p>
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => categoryFileRefs[cat.id].current?.click()}
                        className="w-full flex items-center justify-center gap-2 border border-stone-300 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:border-emerald-700 hover:text-emerald-800 transition-all rounded-sm disabled:opacity-50 cursor-pointer active:scale-95"
                      >
                        <Upload size={15} />
                        {existingImage ? 'Replace Image' : 'Upload Image'}
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={categoryFileRefs[cat.id]}
                        className="hidden"
                        onChange={(e) => handleCategoryImageUpload(e, cat.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {/* --- HAMPER IMAGES TAB --- */}
        {activeTab === 'hamper' && (
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
                disabled={hamperUploadingNew}
                onClick={() => hamperNewFileRef.current?.click()}
                className="bg-emerald-800 text-white px-4 py-2 rounded-sm flex items-center hover:bg-emerald-700 transition-all shadow-sm text-sm cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {hamperUploadingNew ? (
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
              <input
                type="file"
                accept="image/*"
                ref={hamperNewFileRef}
                className="hidden"
                onChange={handleAddHamperImage}
              />
              <input
                type="file"
                accept="image/*"
                ref={hamperReplaceFileRef}
                className="hidden"
                onChange={handleReplaceHamperImage}
              />
            </div>

            {hamperLoading ? (
              <div className="text-center py-20 text-stone-500">Loading hamper images…</div>
            ) : hamperImages.length === 0 ? (
              <div className="bg-white border border-dashed border-stone-300 rounded-sm py-16 text-center">
                <Gift size={40} className="mx-auto text-stone-300 mb-3" />
                <p className="font-serif text-lg text-emerald-950 mb-1">No hamper images yet</p>
                <p className="text-stone-500 text-sm mb-5">
                  Add at least one image to replace the default placeholder shown on the homepage.
                </p>
                <button
                  type="button"
                  disabled={hamperUploadingNew}
                  onClick={() => hamperNewFileRef.current?.click()}
                  className="inline-flex items-center bg-emerald-800 text-white px-4 py-2 rounded-sm hover:bg-emerald-700 transition-all text-sm cursor-pointer active:scale-95 disabled:opacity-60"
                >
                  <Upload size={15} className="mr-2" />
                  {hamperUploadingNew ? 'Uploading…' : 'Upload First Image'}
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {hamperImages.map((img, idx) => {
                  const isReplacing = hamperReplacingId === img.id;
                  const isDeleting = hamperDeletingId === img.id;
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
                            isVisible
                              ? 'bg-emerald-700 text-white'
                              : 'bg-stone-700/80 text-white'
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
                          onClick={() => triggerReplaceHamperImage(img.id)}
                          className="flex-1 inline-flex items-center justify-center gap-2 border border-stone-300 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:border-emerald-700 hover:text-emerald-800 transition-all rounded-sm disabled:opacity-50 cursor-pointer active:scale-95"
                        >
                          <Upload size={15} /> Replace
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleDeleteHamperImage(img.id)}
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
        )}
        {/* --- STORY IMAGES TAB --- */}
        {activeTab === 'story' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-serif text-2xl text-emerald-950">Our Story — Pictures</h2>
                <p className="text-stone-500 text-sm mt-1">
                  Manage the photos shown in the hero of the Our Story page. With multiple images, the hero cross-fades between them. Empty falls back to the default image.
                </p>
              </div>
              <button
                type="button"
                disabled={storyUploadingNew}
                onClick={() => storyNewFileRef.current?.click()}
                className="bg-emerald-800 text-white px-4 py-2 rounded-sm flex items-center hover:bg-emerald-700 transition-all shadow-sm text-sm cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {storyUploadingNew ? (
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
              <input
                type="file"
                accept="image/*"
                ref={storyNewFileRef}
                className="hidden"
                onChange={handleAddStoryImage}
              />
              <input
                type="file"
                accept="image/*"
                ref={storyReplaceFileRef}
                className="hidden"
                onChange={handleReplaceStoryImage}
              />
            </div>

            {storyLoading ? (
              <div className="text-center py-20 text-stone-500">Loading story images…</div>
            ) : storyImages.length === 0 ? (
              <div className="bg-white border border-dashed border-stone-300 rounded-sm py-16 text-center">
                <BookOpen size={40} className="mx-auto text-stone-300 mb-3" />
                <p className="font-serif text-lg text-emerald-950 mb-1">No story images yet</p>
                <p className="text-stone-500 text-sm mb-5">
                  Add at least one image to replace the default hero photo on the Our Story page.
                </p>
                <button
                  type="button"
                  disabled={storyUploadingNew}
                  onClick={() => storyNewFileRef.current?.click()}
                  className="inline-flex items-center bg-emerald-800 text-white px-4 py-2 rounded-sm hover:bg-emerald-700 transition-all text-sm cursor-pointer active:scale-95 disabled:opacity-60"
                >
                  <Upload size={15} className="mr-2" />
                  {storyUploadingNew ? 'Uploading…' : 'Upload First Image'}
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {storyImages.map((img) => {
                  const isReplacing = storyReplacingId === img.id;
                  const isDeleting = storyDeletingId === img.id;
                  const busy = isReplacing || isDeleting;
                  return (
                    <div
                      key={img.id}
                      className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-sm"
                    >
                      <div className="relative aspect-[4/5] bg-stone-100">
                        <Image
                          src={img.image}
                          alt="Story"
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
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
                          onClick={() => triggerReplaceStoryImage(img.id)}
                          className="flex-1 inline-flex items-center justify-center gap-2 border border-stone-300 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:border-emerald-700 hover:text-emerald-800 transition-all rounded-sm disabled:opacity-50 cursor-pointer active:scale-95"
                        >
                          <Upload size={15} /> Replace
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleDeleteStoryImage(img.id)}
                          aria-label="Delete story image"
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
                            placeholder="Rs. 350"
                          />
                       </div>
                       <div className="col-span-2 sm:col-span-1">
                          <label className="block text-sm font-medium text-stone-700 mb-1">Weight</label>
                          <input
                            type="text"
                            value={editingProduct.weight || ''}
                            onChange={(e) => setEditingProduct({...editingProduct, weight: e.target.value || undefined})}
                            className="w-full border border-stone-300 px-3 py-2 rounded-sm focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="225 gms"
                          />
                       </div>
                    </div>
                    <div>
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
                         placeholder="Lower number = appears first"
                       />
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
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Reviewer Photo (optional)</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-emerald-900 flex items-center justify-center flex-shrink-0">
                          {editingTestimonial.image ? (
                            <div className="relative w-14 h-14">
                              <Image src={editingTestimonial.image} alt="Preview" fill sizes="56px" className="object-cover rounded-full" />
                            </div>
                          ) : (
                            <span className="text-stone-50 font-serif text-xl">
                              {editingTestimonial.name.charAt(0) || '?'}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            disabled={testimonialUploading}
                            onClick={() => testimonialFileInputRef.current?.click()}
                            className="px-4 py-2 border border-stone-300 rounded-sm text-sm font-medium text-stone-700 hover:bg-stone-50 flex items-center cursor-pointer disabled:opacity-50"
                          >
                            <Upload size={15} className="mr-2" />
                            {testimonialUploading ? 'Uploading...' : editingTestimonial.image ? 'Change Photo' : 'Upload Photo'}
                          </button>
                          {editingTestimonial.image && (
                            <button
                              type="button"
                              onClick={() => setEditingTestimonial({ ...editingTestimonial, image: undefined })}
                              className="text-xs text-red-400 hover:text-red-600 text-left cursor-pointer"
                            >
                              Remove photo
                            </button>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          ref={testimonialFileInputRef}
                          className="hidden"
                          onChange={handleTestimonialImageUpload}
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-stone-100 flex justify-end space-x-3">
                       <button
                         type="button"
                         disabled={isSaving || testimonialUploading}
                         onClick={() => { setIsFormOpen(false); setEditingTestimonial(null); }}
                         className="px-4 py-2 text-stone-600 hover:text-stone-800 disabled:opacity-50 cursor-pointer active:scale-95 transition-all"
                       >
                         Cancel
                       </button>
                       <button
                         type="submit"
                         disabled={isSaving || testimonialUploading}
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
