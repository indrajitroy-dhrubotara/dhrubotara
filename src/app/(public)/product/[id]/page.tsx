"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, ShoppingBag } from 'lucide-react';
import { useProducts } from '@/lib/useProducts';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { FadeInImage } from '@/components/ui/FadeInImage';
import { trackProductView, trackEvent } from '@/lib/analytics';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useProducts();
  const { addItem, openCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  // Ensure id is a string (useParams can return string or array)
  const productId = Array.isArray(id) ? id[0] : id;
  const product = products.find((p) => p.id === productId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Track product view when product loads
  useEffect(() => {
    if (product) {
      trackProductView({
        id: product.id,
        name: product.name,
        category: product.tag,
        price: product.price ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : undefined,
        currency: 'INR',
      });
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF6E9] pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <Skeleton className="h-6 w-32 mb-8" />
           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div className="bg-white p-4 lg:p-8 shadow-sm">
                 <Skeleton className="aspect-square w-full" />
              </div>
              <div className="flex flex-col justify-center">
                 <Skeleton className="h-12 w-3/4 mb-4" />
                 <Skeleton className="h-8 w-1/3 mb-8" />
                 <div className="space-y-4 mb-10">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                 </div>
                 <Skeleton className="h-14 w-40" />
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF6E9]">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-emerald-950 mb-4">Product Not Found</h2>
          <Link href="/" className="text-emerald-800 hover:text-emerald-600 underline">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF6E9] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/" className="inline-flex items-center text-stone-500 hover:text-emerald-900 mb-8 transition-colors group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-sans text-sm tracking-wide uppercase">Back to Collection</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-4 lg:p-8 shadow-sm"
          >
            <div className="aspect-square bg-stone-100 overflow-hidden relative">
              <FadeInImage
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                containerClassName="w-full h-full"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 text-xs font-sans tracking-widest uppercase text-emerald-900 z-10">
                {product.tag}
              </div>
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <h1 className="font-serif text-4xl md:text-5xl text-emerald-950 mb-4">
              {product.name}
            </h1>
            
            <p className="font-sans text-xl text-emerald-800 mb-8 font-medium">
              {product.price}
            </p>

            <div className="prose prose-stone mb-10 text-stone-600 font-sans leading-relaxed">
              <p>{product.longDescription}</p>
            </div>

            {(() => {
              const highlights = product.features ?? product.codex ?? [];
              return highlights.length > 0 ? (
                <div className="mb-10">
                  <h3 className="font-serif text-lg text-emerald-950 mb-4">Key Highlights</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {highlights.map((feature, index) => (
                      <li key={index} className="flex items-center text-stone-600 font-sans text-sm">
                        <span className="bg-emerald-100 text-emerald-800 p-1 rounded-full mr-3">
                          <Check size={14} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })()}

            <div className="pt-8 border-t border-stone-200">
               <div className="flex flex-col sm:flex-row gap-3">
                 <button
                   type="button"
                   onClick={() => {
                     addItem({
                       id: product.id,
                       name: product.name,
                       image: product.image,
                       price: product.price,
                       tag: product.tag,
                     });
                     setJustAdded(true);
                     window.setTimeout(() => setJustAdded(false), 1500);
                     openCart();
                   }}
                   className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-900 text-stone-50 px-8 py-4 rounded-sm font-sans tracking-wide hover:bg-emerald-800 transition-all active:scale-95 shadow-lg shadow-emerald-900/10 cursor-pointer"
                 >
                   {justAdded ? (
                     <>
                       <Check size={18} /> Added to Cart
                     </>
                   ) : (
                     <>
                       <ShoppingBag size={18} /> Add to Cart
                     </>
                   )}
                 </button>
                 <a
                   href={`https://wa.me/919831574424?text=Hi%2C%20I%20am%20interested%20in%20ordering%20${encodeURIComponent(product.name)}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-950 text-stone-50 text-center px-8 py-4 rounded-sm font-sans tracking-wide hover:bg-emerald-900 transition-all active:scale-95 shadow-lg shadow-emerald-900/10 cursor-pointer no-underline"
                   onClick={() => {
                     trackEvent('whatsapp_order_click', {
                       product_id: product.id,
                       product_name: product.name,
                       product_price: product.price ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : undefined,
                       currency: 'INR',
                     });
                   }}
                 >
                   <span className="text-lg">💬</span> Order via WhatsApp
                 </a>
               </div>
               <p className="mt-4 text-center sm:text-left text-xs text-stone-400 font-sans">
                 * Due to the artisanal nature of our products, stock is limited.
               </p>

               {/* How to Order Section */}
               <div className="mt-12 bg-emerald-50/50 p-6 rounded-sm border border-emerald-100">
                  <h4 className="font-serif text-lg text-emerald-950 mb-4">How to Order</h4>
                  <ol className="list-decimal list-inside space-y-3 text-stone-700 font-sans text-sm">
                    <li><strong className="text-emerald-900">Click the button</strong> above to open WhatsApp.</li>
                    <li><strong className="text-emerald-900">Send the message</strong> to confirm availability.</li>
                    <li><strong className="text-emerald-900">Pay via UPI</strong> and we will ship it to your doorstep.</li>
                  </ol>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
