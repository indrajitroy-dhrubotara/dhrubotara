"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { FadeInImage } from "./ui/FadeInImage";
import { trackEvent } from "@/lib/analytics";
import { useCart } from "@/context/CartContext";

interface ProductProps {
  id: string;
  name: string;
  description: string;
  image: string;
  tag: string;
  price?: string;
  priority?: boolean;
  dark?: boolean;
}

export function ProductCard({ id, name, description, image, tag, price, priority, dark }: ProductProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, image, price });
    trackEvent("add_to_cart", {
      item_id: id,
      item_name: name,
      item_category: tag,
      price: price ? parseFloat(price.replace(/[^0-9.]/g, "")) : undefined,
      currency: "INR",
    });
  };

  return (
    <Link
      href={`/product/${id}`}
      className="block"
      onClick={() => {
        trackEvent("select_item", {
          item_list_id: "product_grid",
          item_list_name: "Product Collection",
          items: [{ item_id: id, item_name: name, item_category: tag }],
        });
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.5 }}
        className="group cursor-pointer"
      >
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-stone-100 mb-5">
          <FadeInImage
            src={image}
            alt={name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            containerClassName="w-full h-full"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Tag badge */}
          <div className="absolute top-3 left-3 bg-emerald-900 text-stone-50 px-3 py-1 text-[10px] font-sans tracking-widest uppercase z-10">
            {tag}
          </div>

          {/* Hover overlay with "View Details" */}
          <div className="absolute inset-0 bg-emerald-950/0 group-hover:bg-emerald-950/10 transition-colors duration-300 z-0" />
          <div className="absolute bottom-0 left-0 right-0 bg-emerald-950 text-stone-50 px-4 py-2.5 flex items-center justify-between font-sans text-xs tracking-wide translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
            <span className="uppercase tracking-widest">View Details</span>
            <ArrowUpRight size={14} />
          </div>
        </div>

        {/* Info */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className={`font-serif text-xl md:text-2xl leading-tight transition-colors ${
            dark
              ? "text-stone-50 group-hover:text-emerald-300"
              : "text-emerald-950 group-hover:text-emerald-700"
          }`}>
            {name}
          </h3>
          {price && (
            <span className={`font-sans text-sm font-medium whitespace-nowrap pt-1 ${
              dark ? "text-emerald-400" : "text-emerald-800"
            }`}>
              {price}
            </span>
          )}
        </div>
        <p className={`font-sans text-sm leading-relaxed ${dark ? "text-stone-400" : "text-stone-500"}`}>
          {description}
        </p>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm font-sans text-xs tracking-widest uppercase transition-all active:scale-95 cursor-pointer ${
            dark
              ? "bg-stone-50 text-emerald-950 hover:bg-amber-200"
              : "bg-emerald-900 text-stone-50 hover:bg-emerald-800"
          }`}
        >
          <ShoppingBag size={14} />
          Add to Cart
        </button>
      </motion.div>
    </Link>
  );
}
