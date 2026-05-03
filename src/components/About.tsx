"use client";
import { motion } from 'framer-motion';
import { FadeInImage } from './ui/FadeInImage';
import { Tree, Leaf } from './ui/Botanical';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export function About() {
  return (
    <section id="story" className="relative py-16 md:py-24 bg-[#FBF6E9] overflow-hidden border-b border-stone-100">
      {/* Botanical accents */}
      <div className="absolute -top-4 right-2 w-32 md:w-44 h-44 md:h-56 text-emerald-900 pointer-events-none">
        <Tree className="w-full h-full" />
      </div>
      <div className="absolute bottom-0 -left-8 w-24 md:w-32 h-48 md:h-64 text-emerald-900 pointer-events-none opacity-50">
        <Leaf className="w-full h-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <span className="text-emerald-800 font-sans tracking-[0.2em] text-xs uppercase block mb-4">
              Our Heritage
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-emerald-950 mb-8">
              The Dhrubotara Genesis
            </h2>
            <div className="space-y-6 text-stone-600 font-sans text-lg leading-relaxed">
              <p>
                In India, the &ldquo;Vaidya&rdquo; community were known for being practitioners of medicine. My family that belonged to this community boasted of some well-known doctors and healers.
              </p>
              <p>
                Dr. Subol Majumdar, my mother&apos;s uncle, was one such individual — a well-known Ayurvedic doctor whose knowledge of herbs, roots and seeds was infinite. My mother, grandmother and great grandmother were women of profound wisdom who would create miracles from the kitchen larder.
              </p>
              <p>
                Unknown to me, my initiation in sustained wellness began with them.
              </p>
              <blockquote className="border-l-2 border-emerald-700 pl-5 pt-2">
                <p className="font-serif italic text-emerald-900 text-xl leading-relaxed">
                  &ldquo;They are not mere mixtures but memories that help me carry forward my legacy of wellness.&rdquo;
                </p>
              </blockquote>
            </div>
            <div className="mt-8">
              <Link
                href="/story"
                className="inline-flex items-center gap-2 bg-emerald-900 text-stone-50 px-6 py-3 rounded-sm font-sans text-sm tracking-wide hover:bg-emerald-800 transition-all cursor-pointer active:scale-95"
                onClick={() => trackEvent('story_link_click', { source: 'about_section' })}
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
