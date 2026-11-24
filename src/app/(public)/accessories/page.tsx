"use client";

import { motion } from 'framer-motion';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { FadeInImage } from '@/components/ui/FadeInImage';
import { Leaf, Sprig, Branch } from '@/components/ui/Botanical';
import { useProducts } from '@/lib/useProducts';
import { useCategoryImages } from '@/lib/useCategoryImages';
import { resolveProductCategory } from '@/lib/productCategory';
import { useArtistAbout } from '@/lib/useArtistAbout';
import { AboutTheArtist } from '@/components/AboutTheArtist';

const CRAFTS = [
  {
    title: 'Hand-Painted Bags',
    description: 'Wearable canvases — cotton and jute bags painted by hand, each motif unique to the artisan who made it.',
  },
  {
    title: 'Trays & Platters',
    description: 'Serving pieces for the table: lacquered trays and painted platters that turn everyday meals into ceremony.',
  },
  {
    title: 'Pots & Vessels',
    description: 'Earthen and ceramic pots, planters, and keepers — functional objects finished with traditional brushwork.',
  },
];

export default function AccessoriesPage() {
  const { products, loading } = useProducts();
  const { getImage } = useCategoryImages();
  const {
    name: artistName,
    description: artistDescription,
    slotImages: artistImages,
    loading: artistLoading,
  } = useArtistAbout();
  const heroImage = getImage('accessories');

  const accessories = products.filter(
    (product) => resolveProductCategory(product) === 'accessories',
  );

  return (
    <div className="pt-20">
      <section className="relative overflow-hidden bg-[#FBF6E9] border-b border-stone-100 py-16 md:py-24">
        <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />
        <div className="absolute top-8 left-2 w-20 md:w-32 h-32 md:h-48 text-emerald-900 pointer-events-none">
          <Sprig className="w-full h-full" />
        </div>
        <div className="absolute bottom-4 right-2 w-24 md:w-40 h-36 md:h-52 text-emerald-900 pointer-events-none opacity-70">
          <Leaf className="w-full h-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid gap-12 md:gap-16 items-center ${heroImage ? 'md:grid-cols-2' : ''}`}>
            {heroImage && (
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="aspect-[4/5] bg-stone-200 overflow-hidden rounded-sm shadow-xl relative">
                  <FadeInImage
                    src={heroImage}
                    alt="Hand-painted art accessories"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    containerClassName="w-full h-full"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-50 -z-10 rounded-full" />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={heroImage ? '' : 'max-w-3xl mx-auto text-center'}
            >
              <span className="text-emerald-800 font-sans tracking-[0.2em] text-xs md:text-sm uppercase block mb-4">
                Hand-painted objects
              </span>
              <h1 className="font-serif text-4xl md:text-6xl text-emerald-950 mb-4 leading-tight">
                Art Accessories
              </h1>
              <p className="font-serif italic text-emerald-900 text-xl md:text-2xl mb-8">
                Bags, trays, pots, and other painted pieces for the home
              </p>
              <p className={`font-sans text-base md:text-lg text-stone-600 leading-relaxed ${heroImage ? 'max-w-xl' : 'max-w-2xl mx-auto'}`}>
                Alongside our pantry and wellness goods, Dhrubotara also offers artisanal accessories —
                hand-painted bags, serving trays, pots, and other objects made with the same care as our kitchen traditions.
                Each piece is a small canvas, meant to be used and lived with.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <AboutTheArtist
        name={artistName}
        description={artistDescription}
        images={artistImages}
        loading={artistLoading}
      />

      <section className="relative py-16 md:py-24 bg-white overflow-hidden">
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 md:w-64 h-16 md:h-20 text-emerald-900 pointer-events-none opacity-40">
          <Branch className="w-full h-full" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-emerald-800 font-sans tracking-[0.2em] text-xs uppercase block mb-3">
              What you will find
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-emerald-950">
              Painted for everyday living
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-stone-200">
            {CRAFTS.map((craft, index) => (
              <motion.div
                key={craft.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-8 md:p-10 bg-[#FBF6E9] ${
                  index < CRAFTS.length - 1 ? 'md:border-r border-b md:border-b-0 border-stone-200' : ''
                }`}
              >
                <span className="font-serif text-4xl text-emerald-950/10 block mb-4">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-2xl text-emerald-950 mb-3">{craft.title}</h3>
                <p className="font-sans text-sm text-stone-500 leading-relaxed">{craft.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="accessories-collection" className="relative py-16 md:py-24 bg-[#FBF6E9] overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-16"
          >
            <span className="font-sans tracking-[0.2em] text-xs uppercase text-amber-800 block mb-2">
              Collection
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-emerald-950 leading-tight">
              Available pieces
            </h2>
            <div className="flex items-start gap-4 max-w-2xl mt-6">
              <div className="w-px h-12 flex-shrink-0 mt-1 bg-emerald-900/20" />
              <p className="font-sans text-base text-stone-500 leading-relaxed">
                Browse hand-painted accessories and add them to your cart. Orders are confirmed on WhatsApp, just like our food and wellness products.
              </p>
            </div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-square w-full mb-6" />
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : accessories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 md:gap-y-12">
              {accessories.map((product, index) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  priority={index < 4}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-stone-200 rounded-sm">
              <p className="font-serif italic text-lg text-stone-400">
                Art accessories are currently being curated.
              </p>
              <p className="font-sans text-sm text-stone-400 mt-2">
                Check back soon, or message us on WhatsApp for available pieces.
              </p>
              <a
                href="https://wa.me/919831574424?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%20hand-painted%20accessories."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 bg-emerald-900 text-stone-50 px-6 py-3 rounded-sm font-sans text-sm tracking-wide hover:bg-emerald-800 transition-all"
              >
                Enquire on WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
