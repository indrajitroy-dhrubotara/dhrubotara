"use client";
import { motion } from 'framer-motion';
import { FadeInImage } from './ui/FadeInImage';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function About() {
  return (
    <section id="story" className="py-16 md:py-24 bg-white overflow-hidden border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
             <div className="aspect-[4/5] bg-stone-200 overflow-hidden rounded-sm shadow-xl">
                <FadeInImage
                  src="/trees.jpg"
                  alt="Nature"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
             </div>
             <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-50 -z-10 rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-emerald-950 mb-8">
              Our Story
            </h2>
            <div className="space-y-6 text-stone-600 font-sans text-lg leading-relaxed">
              <p>
                At Dhrubotara, we inherited a rich legacy of having lovingly curated the rare and precious resources of nature to care and cure. It&apos;s a tradition of love passed down through generations bottled with love for your everyday nourishment and care.
              </p>
              <p>
                Natural remedies, artisanal condiments, gourmet accents that are rich in the flavours of Bengal&apos;s heritage and culture. Each one tried, tested and treasured.
              </p>
              <p>
                We source our ingredients from people who know nature the best and package them with extreme care to keep their natural richness intact. You deserve only the purest, the richest and the choiciest of all that nature has to offer.
              </p>
              <p className="font-serif italic text-emerald-900 text-xl pt-2">
                &ldquo;Dip into its bounty with every Dhrubotara product.&rdquo;
              </p>
            </div>
            <div className="mt-8">
              <Link 
                href="/story"
                className="inline-flex items-center gap-2 bg-emerald-900 text-stone-50 px-6 py-3 rounded-sm font-sans text-sm tracking-wide hover:bg-emerald-800 transition-all cursor-pointer active:scale-95"
              >
                Read Our Full Story
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
