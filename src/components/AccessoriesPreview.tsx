"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sprig } from './ui/Botanical';

export function AccessoriesPreview() {
  return (
    <section className="relative overflow-hidden bg-emerald-950 py-16 md:py-24">
      <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
      <div className="absolute top-6 left-2 w-20 md:w-28 h-32 md:h-44 text-emerald-700 opacity-40 pointer-events-none">
        <Sprig className="w-full h-full" />
      </div>
      <div
        className="absolute bottom-4 right-2 w-20 md:w-28 h-32 md:h-44 text-emerald-700 opacity-40 pointer-events-none"
        style={{ transform: 'scaleX(-1)' }}
      >
        <Sprig className="w-full h-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-emerald-300 font-sans tracking-[0.2em] text-xs uppercase block mb-4">
            Also from our studio
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-white mb-5 leading-tight">
            Hand-painted accessories
          </h2>
          <p className="font-sans text-base md:text-lg text-emerald-100/80 leading-relaxed max-w-2xl mx-auto mb-10">
            Bags, trays, pots, and other painted objects — made to sit beside our pantry goods in a homely, artisanal home.
          </p>
          <Link
            href="/accessories"
            className="inline-flex items-center gap-2 bg-white text-emerald-950 px-8 py-3 rounded-sm font-sans text-sm tracking-wide hover:bg-stone-100 transition-all active:scale-95 no-underline"
          >
            Explore Accessories
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
