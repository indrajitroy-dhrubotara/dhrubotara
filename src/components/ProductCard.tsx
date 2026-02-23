"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FadeInImage } from './ui/FadeInImage';
import { trackEvent } from '@/lib/analytics';

interface ProductProps {
  id: string;
  name: string;
  description: string;
  image: string;
  tag: string;
  priority?: boolean;
}

export function ProductCard({ id, name, description, image, tag, priority }: ProductProps) {
  return (
    <Link 
      href={`/product/${id}`} 
      className="block"
      onClick={() => {
        trackEvent('select_item', {
          item_list_id: 'product_grid',
          item_list_name: 'Product Collection',
          items: [{
            item_id: id,
            item_name: name,
            item_category: tag,
          }],
        });
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.5 }}
        className="group cursor-pointer"
      >
        <div className="relative aspect-square overflow-hidden bg-stone-100 mb-6">
          <FadeInImage
            src={image}
            alt={name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            containerClassName="w-full h-full"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-sans tracking-widest uppercase text-emerald-900 z-10">
            {tag}
          </div>
        </div>
        
        <h3 className="font-serif text-2xl text-emerald-950 mb-2 group-hover:text-emerald-700 transition-colors">
          {name}
        </h3>
        <p className="text-stone-500 font-sans text-sm leading-relaxed">
          {description}
        </p>
      </motion.div>
    </Link>
  );
}
