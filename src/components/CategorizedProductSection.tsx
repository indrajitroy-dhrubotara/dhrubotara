"use client";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "./ui/Skeleton";
import { useProducts } from "@/lib/useProducts";
import { type Product, type ProductCategory } from "@/lib/types";

interface CategoryConfig {
  id: ProductCategory;
  label: string;
  title: string;
  description: string;
  bg: string;
  eyebrow: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: "condiments",
    label: "01",
    title: "Pickles & Condiments",
    description:
      "Hand-crafted with age-old Bengali recipes — tangy, spiced, and rich with tradition. Perfect companions for every meal.",
    bg: "bg-[#F5F5F0]",
    eyebrow: "text-amber-800",
  },
  {
    id: "herbal",
    label: "02",
    title: "Herbal Medicines",
    description:
      "Rooted in the Vaidya tradition of Bengal. Pure, time-tested totkas for everyday wellness, drawn from generations of healing wisdom.",
    bg: "bg-emerald-950",
    eyebrow: "text-emerald-400",
  },
  {
    id: "rice-other",
    label: "03",
    title: "Rice & Other Products",
    description:
      "Artisanal pantry staples — Bori, Choshi, and seasonal specialties crafted by skilled women of Bengal's villages.",
    bg: "bg-white",
    eyebrow: "text-stone-500",
  },
];

function CategorySkeleton({ dark }: { dark?: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <Skeleton className={`aspect-square w-full mb-6 ${dark ? "opacity-20" : ""}`} />
          <Skeleton className={`h-7 w-3/4 mb-2 ${dark ? "opacity-20" : ""}`} />
          <Skeleton className={`h-12 w-full ${dark ? "opacity-20" : ""}`} />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ dark, title }: { dark?: boolean; title: string }) {
  return (
    <div
      className={`text-center py-16 border border-dashed rounded-sm ${
        dark
          ? "border-emerald-800 text-emerald-500"
          : "border-stone-200 text-stone-400"
      }`}
    >
      <p className={`font-serif italic text-lg ${dark ? "text-emerald-400" : "text-stone-400"}`}>
        {title} coming soon.
      </p>
    </div>
  );
}

interface Props {
  preloadedProducts?: Product[] | null;
}

function resolveProductCategory(product: Product): ProductCategory | undefined {
  if (product.productCategory) return product.productCategory;

  const legacy = product.category?.trim().toLowerCase();
  if (!legacy) return undefined;

  if (["condiments", "pickle", "pickles", "pickles & condiments", "pickles and condiments"].includes(legacy)) {
    return "condiments";
  }

  if (["herbal", "herbal medicines", "natural remedies", "remedies"].includes(legacy)) {
    return "herbal";
  }

  if (["rice-other", "rice_other", "rice & other", "rice and other", "rice & other products", "rice and other products"].includes(legacy)) {
    return "rice-other";
  }

  return undefined;
}

export function CategorizedProductSection({ preloadedProducts }: Props) {
  const { products, loading } = useProducts(preloadedProducts);

  return (
    <div id="products">
      {CATEGORIES.map((cat, catIndex) => {
        const isDark = cat.id === "herbal";
        const catProducts = products.filter((p) => {
          const resolvedCategory = resolveProductCategory(p);
          return resolvedCategory === cat.id;
        });

        return (
          <section
            key={cat.id}
            id={`category-${cat.id}`}
            className={`py-16 md:py-24 ${cat.bg} ${
              catIndex < CATEGORIES.length - 1 ? "border-b border-stone-200/30" : ""
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-12 md:mb-16"
              >
                <div className="flex items-end gap-6 mb-4">
                  <span
                    className={`font-serif text-6xl md:text-8xl font-bold leading-none select-none ${
                      isDark ? "text-white/5" : "text-emerald-950/5"
                    }`}
                  >
                    {cat.label}
                  </span>
                  <div className="pb-1">
                    <span
                      className={`font-sans tracking-[0.2em] text-xs uppercase block mb-1 ${cat.eyebrow}`}
                    >
                      {cat.id === "condiments"
                        ? "Pickles & Condiments"
                        : cat.id === "herbal"
                        ? "Natural Remedies"
                        : "Artisanal Staples"}
                    </span>
                    <h2
                      className={`font-serif text-3xl md:text-5xl leading-tight ${
                        isDark ? "text-white" : "text-emerald-950"
                      }`}
                    >
                      {cat.title}
                    </h2>
                  </div>
                </div>
                <div
                  className={`flex items-start gap-4 max-w-2xl ${
                    isDark ? "" : "pl-0"
                  }`}
                >
                  <div
                    className={`w-px h-12 flex-shrink-0 mt-1 ${
                      isDark ? "bg-emerald-700" : "bg-emerald-900/20"
                    }`}
                  />
                  <p
                    className={`font-sans text-base leading-relaxed ${
                      isDark ? "text-stone-300" : "text-stone-500"
                    }`}
                  >
                    {cat.description}
                  </p>
                </div>
              </motion.div>

              {/* Products grid */}
              {loading ? (
                <CategorySkeleton dark={isDark} />
              ) : catProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 md:gap-y-12">
                  {catProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      priority={catIndex === 0 && index < 4}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState dark={isDark} title={cat.title} />
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
