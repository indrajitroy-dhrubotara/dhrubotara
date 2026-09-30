"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/lib/useProducts';
import { useTestimonials } from '@/lib/useTestimonials';
import { useRouter } from 'next/navigation';
import { type Product, type ProductCategory, type Testimonial } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';
import { useCategoryImages } from '@/lib/useCategoryImages';
import { useHamperImages } from '@/lib/useHamperImages';
import { useStoryImages } from '@/lib/useStoryImages';
import { isFirebaseConfigured } from '@/lib/firebase';
import { type AdminTab } from '@/components/admin/types';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { DashboardTabs } from '@/components/admin/DashboardTabs';
import { ProductsTab } from '@/components/admin/ProductsTab';
import { TestimonialsTab } from '@/components/admin/TestimonialsTab';
import { ReorderTestimonialsTab } from '@/components/admin/ReorderTestimonialsTab';
import { CategorizeTab } from '@/components/admin/CategorizeTab';
import { CategoryImagesTab } from '@/components/admin/CategoryImagesTab';
import { HamperImagesTab } from '@/components/admin/HamperImagesTab';
import { StoryImagesTab } from '@/components/admin/StoryImagesTab';
import { ProductFormModal } from '@/components/admin/ProductFormModal';
import { TestimonialFormModal } from '@/components/admin/TestimonialFormModal';
import { SeedJsonModal } from '@/components/admin/SeedJsonModal';

const DEVELOPER_STORAGE_KEY = 'dhrubotara-admin-developer';

function emptyProduct(): Product {
  return {
    id: `new-${Date.now()}`,
    name: '',
    description: '',
    longDescription: '',
    image: '',
    tag: '',
    price: '',
    features: [],
    sortPriority: undefined,
    productCategory: undefined,
  };
}

function emptyTestimonial(): Testimonial {
  return {
    id: `new-t-${Date.now()}`,
    name: '',
    text: '',
    category: '',
    role: '',
  };
}

export default function AdminDashboard() {
  const { user, signOut, isAdmin, loading: authLoading } = useAuth();
  const { products, loading: pLoading, saveProduct, deleteProduct } = useProducts();
  const { testimonials, loading: tLoading, saveTestimonial, deleteTestimonial, reorderTestimonials } = useTestimonials();
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
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [developerMode, setDeveloperMode] = useState(false);
  const [reorderingTestimonials, setReorderingTestimonials] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSeedOpen, setIsSeedOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setDeveloperMode(window.localStorage.getItem(DEVELOPER_STORAGE_KEY) === '1');
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      router.push('/admin');
    }
  }, [user, isAdmin, authLoading, router]);

  const toggleDeveloperMode = () => {
    setDeveloperMode((prev) => {
      const next = !prev;
      window.localStorage.setItem(DEVELOPER_STORAGE_KEY, next ? '1' : '0');
      if (!next) setIsSeedOpen(false);
      return next;
    });
  };

  const handleLogout = async () => {
    trackEvent('admin_logout');
    await signOut();
    router.push('/admin');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
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
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      trackEvent('admin_action', { action: 'delete_product', product_id: id });
    }
  };

  const handleSeed = async (items: unknown[]) => {
    setIsSaving(true);
    try {
      let count = 0;
      for (const item of items) {
        await saveProduct(item as Product);
        count++;
      }
      alert(`Successfully seeded ${count} products.`);
      setIsSeedOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to seed data. Check console for details. Ensure JSON is valid.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
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
      alert('Failed to save testimonial.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm('Delete this testimonial?')) {
      await deleteTestimonial(id);
      trackEvent('admin_action', { action: 'delete_testimonial', testimonial_id: id });
    }
  };

  const handleMoveTestimonial = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;
    setReorderingTestimonials(true);
    try {
      const ids = testimonials.map((t) => t.id);
      [ids[index], ids[targetIndex]] = [ids[targetIndex], ids[index]];
      await reorderTestimonials(ids);
      trackEvent('admin_action', {
        action: 'reorder_testimonials',
        moved_from: index,
        moved_to: targetIndex,
      });
    } catch (err) {
      console.error('Reorder failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Reorder failed.\n\n${msg}`);
    } finally {
      setReorderingTestimonials(false);
    }
  };

  const handleAssignCategory = async (product: Product, category: ProductCategory | undefined) => {
    await saveProduct({ ...product, productCategory: category });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <DashboardHeader
        phoneNumber={user?.phoneNumber}
        developerMode={developerMode}
        onToggleDeveloperMode={toggleDeveloperMode}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isFirebaseConfigured && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-sm px-5 py-4 text-sm text-red-800">
            <strong className="font-semibold">Firebase not configured.</strong> Saves and uploads will fail until you add your Firebase credentials.{' '}
            Create a <code className="bg-red-100 px-1 rounded">.env.local</code> file with your <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_FIREBASE_*</code> values, then restart the dev server.
          </div>
        )}

        <DashboardTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            loading={pLoading}
            developerMode={developerMode}
            onCreate={() => {
              setEditingProduct(emptyProduct());
              setIsFormOpen(true);
            }}
            onEdit={(product) => {
              setEditingProduct(product);
              setIsFormOpen(true);
            }}
            onDelete={handleDeleteProduct}
            onOpenSeed={() => setIsSeedOpen(true)}
          />
        )}

        {activeTab === 'testimonials' && (
          <TestimonialsTab
            testimonials={testimonials}
            loading={tLoading}
            onCreate={() => {
              setEditingTestimonial(emptyTestimonial());
              setIsFormOpen(true);
            }}
            onEdit={(testimonial) => {
              setEditingTestimonial(testimonial);
              setIsFormOpen(true);
            }}
            onDelete={handleDeleteTestimonial}
          />
        )}

        {activeTab === 'reorder-testimonials' && (
          <ReorderTestimonialsTab
            testimonials={testimonials}
            loading={tLoading}
            reordering={reorderingTestimonials}
            onMove={handleMoveTestimonial}
          />
        )}

        {activeTab === 'categorize' && (
          <CategorizeTab
            products={products}
            loading={pLoading}
            onAssign={handleAssignCategory}
          />
        )}

        {activeTab === 'categories' && (
          <CategoryImagesTab getImage={getImage} saveImage={saveImage} />
        )}

        {activeTab === 'hamper' && (
          <HamperImagesTab
            images={hamperImages}
            loading={hamperLoading}
            addImage={addHamperImage}
            updateImage={updateHamperImage}
            removeImage={removeHamperImage}
          />
        )}

        {activeTab === 'story' && (
          <StoryImagesTab
            images={storyImages}
            loading={storyLoading}
            addImage={addStoryImage}
            updateImage={updateStoryImage}
            removeImage={removeStoryImage}
          />
        )}
      </main>

      {developerMode && isSeedOpen && (
        <SeedJsonModal
          isSaving={isSaving}
          onClose={() => setIsSeedOpen(false)}
          onSeed={handleSeed}
        />
      )}

      {isFormOpen && editingProduct && (
        <ProductFormModal
          product={editingProduct}
          isSaving={isSaving}
          onChange={setEditingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
        />
      )}

      {isFormOpen && editingTestimonial && (
        <TestimonialFormModal
          testimonial={editingTestimonial}
          isSaving={isSaving}
          onChange={setEditingTestimonial}
          onSave={handleSaveTestimonial}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTestimonial(null);
          }}
        />
      )}
    </div>
  );
}
