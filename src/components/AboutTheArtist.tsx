"use client";

import { motion } from 'framer-motion';
import { FadeInImage } from '@/components/ui/FadeInImage';
import { Sprig } from '@/components/ui/Botanical';
import { Skeleton } from '@/components/ui/Skeleton';
import { ARTIST_IMAGE_SLOTS } from '@/lib/types';

interface AboutTheArtistProps {
  name?: string;
  description?: string;
  images?: (string | undefined)[];
  loading?: boolean;
}

export function AboutTheArtist({
  name = '',
  description = '',
  images = [],
  loading = false,
}: AboutTheArtistProps) {
  const filledImages = ARTIST_IMAGE_SLOTS.map((_, index) => images[index]).filter(
    (src): src is string => Boolean(src),
  );
  const hasContent = Boolean(name.trim() || description.trim() || filledImages.length > 0);

  if (loading) {
    return (
      <section className="relative py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {ARTIST_IMAGE_SLOTS.map((slot) => (
                <Skeleton key={slot} className="aspect-square w-full" />
              ))}
            </div>
            <div>
              <Skeleton className="h-5 w-32 mb-4" />
              <Skeleton className="h-10 w-3/4 mb-6" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!hasContent) return null;

  const paragraphs = description
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section id="about-the-artist" className="relative py-16 md:py-24 bg-white overflow-hidden">
      <div className="absolute top-8 right-2 w-20 md:w-28 h-32 md:h-44 text-emerald-900 pointer-events-none opacity-50 hidden md:block">
        <Sprig className="w-full h-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid gap-12 md:gap-16 items-center ${filledImages.length > 0 ? 'md:grid-cols-2' : ''}`}>
          {filledImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-3 md:gap-4"
          >
            {ARTIST_IMAGE_SLOTS.map((slot, index) => {
              const src = images[index];
              return (
                <div
                  key={slot}
                  className="relative aspect-square overflow-hidden rounded-sm bg-stone-100"
                >
                  {src ? (
                    <FadeInImage
                      src={src}
                      alt={name ? `${name}, artist photo ${index + 1}` : `Artist photo ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      containerClassName="w-full h-full"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-stone-100" />
                  )}
                </div>
              );
            })}
          </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={filledImages.length > 0 ? '' : 'max-w-3xl'}
          >
            <span className="text-emerald-800 font-sans tracking-[0.2em] text-xs uppercase block mb-3">
              The maker
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-emerald-950 mb-4 leading-tight">
              About the Artist
            </h2>
            {name ? (
              <p className="font-serif italic text-emerald-900 text-xl md:text-2xl mb-6">
                {name}
              </p>
            ) : null}
            {paragraphs.length > 0 ? (
              <div className="space-y-4 font-sans text-base md:text-lg text-stone-600 leading-relaxed">
                {paragraphs.map((paragraph, index) => (
                  <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="font-serif italic text-stone-400">
                The artist&apos;s story will appear here.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
