"use client";
import { ProductCard } from './ProductCard';
import { useProducts } from '../lib/useProducts';
import { Skeleton } from './ui/Skeleton';
import { type Product } from '@/lib/types';

interface ProductSectionProps {
  preloadedProducts?: Product[] | null;
}

export function ProductSection({ preloadedProducts }: ProductSectionProps) {
  const { products, loading } = useProducts(preloadedProducts);

  return (
    <section id="products" className="py-16 md:py-24 bg-[#F5F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <span className="text-emerald-800 font-sans tracking-[0.2em] text-xs md:text-sm uppercase block mb-4">
            Curated Collection
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-emerald-950">
            Handpicked Goods
          </h2>
          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-12 bg-emerald-900/20" />
            <svg viewBox="0 0 32 32" className="w-5 h-5 text-emerald-800/30" fill="currentColor">
              <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 26C9.373 28 4 22.627 4 16S9.373 4 16 4s12 5.373 12 12-5.373 12-12 12z" />
              <path d="M16 8a1 1 0 0 1 1 1v6.586l3.707 3.707a1 1 0 0 1-1.414 1.414l-4-4A1 1 0 0 1 15 16V9a1 1 0 0 1 1-1z" />
            </svg>
            <div className="h-px w-12 bg-emerald-900/20" />
          </div>
        </div>

        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 md:gap-y-12">
             {[...Array(4)].map((_, i) => (
               <div key={i}>
                 <Skeleton className="aspect-square w-full mb-6" />
                 <Skeleton className="h-8 w-3/4 mb-2" />
                 <Skeleton className="h-16 w-full" />
               </div>
             ))}
           </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 md:gap-y-12">
            {products.map((product, index) => (
              <ProductCard key={product.id} {...product} priority={index < 4} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-stone-50 rounded-sm border border-dashed border-stone-200">
             <p className="text-stone-500 font-serif text-lg">Our collection is currently being curated.</p>
             <p className="text-stone-400 text-sm mt-2">Check back soon for new arrivals.</p>
          </div>
        )}
      </div>
    </section>
  );
}
