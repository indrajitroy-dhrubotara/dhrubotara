"use client";
import { motion } from "framer-motion";

const CATEGORIES = [
  {
    id: "pickles",
    label: "01",
    title: "Pickles & Condiments",
    subtitle: "Traditional Bengali Flavours",
    description:
      "Hand-crafted with age-old recipes — from tangy Aam Kasundi to rich Aam Gur, Shrimp Balachaung, and mixed vegetable pickles. Each jar carries the warmth of a Bengali kitchen.",
    items: ["Aam Kasundi", "Aam Gur", "Mixed Vegetable Pickle", "Shrimp Balachaung", "Spiced Honey", "Desi Ghee"],
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
        {/* Jar body */}
        <rect x="18" y="26" width="28" height="28" rx="3" fill="currentColor" opacity="0.12" />
        <rect x="18" y="26" width="28" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" />
        {/* Jar lid */}
        <rect x="15" y="20" width="34" height="8" rx="2" fill="currentColor" opacity="0.2" />
        <rect x="15" y="20" width="34" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
        {/* Lid top */}
        <rect x="22" y="16" width="20" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        {/* Contents swirl */}
        <path d="M24 38 Q28 34 32 38 Q36 42 40 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M22 44 Q27 40 32 44 Q37 48 42 44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
        {/* Leaf garnish */}
        <path d="M48 14 C52 10 56 12 54 18 C52 22 48 20 48 14Z" fill="currentColor" opacity="0.3" />
        <path d="M48 14 L54 18" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
    bg: "bg-[#F5F5F0]",
    accent: "border-amber-700/30",
    accentText: "text-amber-800",
    accentDot: "bg-amber-700",
  },
  {
    id: "herbal",
    label: "02",
    title: "Herbal Medicines",
    subtitle: "Ancient Totkas, Modern Wellness",
    description:
      "Rooted in the Vaidya tradition of Bengal, our remedies are drawn from yellowed notebook pages of healing wisdom — pure, time-tested mixtures for everyday wellness.",
    items: ["Wellness Blends", "Natural Remedies", "Herbal Tonics", "Totka Mixtures"],
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
        {/* Mortar */}
        <path d="M14 40 Q14 52 32 52 Q50 52 50 40 L46 30 H18 Z" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.5" />
        {/* Pestle */}
        <rect x="28" y="16" width="8" height="18" rx="4" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
        {/* Herbs/leaves */}
        <path d="M10 22 C8 16 14 12 16 18 C14 20 12 22 10 22Z" fill="currentColor" opacity="0.35" />
        <path d="M10 22 L16 18" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <path d="M52 20 C54 14 48 10 46 16 C48 18 50 20 52 20Z" fill="currentColor" opacity="0.35" />
        <path d="M52 20 L46 16" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        {/* Stars / particles */}
        <circle cx="22" cy="26" r="1.5" fill="currentColor" opacity="0.4" />
        <circle cx="42" cy="24" r="1.5" fill="currentColor" opacity="0.4" />
        <circle cx="32" cy="22" r="1" fill="currentColor" opacity="0.3" />
        {/* Band on mortar */}
        <path d="M18 36 Q32 38 46 36" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
    bg: "bg-emerald-950",
    accent: "border-emerald-400/30",
    accentText: "text-emerald-300",
    accentDot: "bg-emerald-400",
    dark: true,
  },
  {
    id: "rice",
    label: "03",
    title: "Rice & Other Products",
    subtitle: "Bengal's Artisanal Staples",
    description:
      "From Bori and Choshi crafted by women of West Midnapore to artisanal pantry staples steeped in Bengali culinary tradition — nourishment as nature intended.",
    items: ["Bori (Goyna, Masala, Hing)", "Choshi", "Artisanal Staples", "Seasonal Specials"],
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
        {/* Bowl */}
        <path d="M10 30 Q10 50 32 50 Q54 50 54 30" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
        <line x1="8" y1="30" x2="56" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Rice grains */}
        <ellipse cx="24" cy="24" rx="3" ry="1.5" transform="rotate(-20 24 24)" fill="currentColor" opacity="0.5" />
        <ellipse cx="32" cy="21" rx="3" ry="1.5" fill="currentColor" opacity="0.5" />
        <ellipse cx="40" cy="24" rx="3" ry="1.5" transform="rotate(20 40 24)" fill="currentColor" opacity="0.5" />
        <ellipse cx="28" cy="17" rx="2.5" ry="1.2" transform="rotate(-10 28 17)" fill="currentColor" opacity="0.35" />
        <ellipse cx="36" cy="17" rx="2.5" ry="1.2" transform="rotate(10 36 17)" fill="currentColor" opacity="0.35" />
        {/* Steam lines */}
        <path d="M24 10 C22 7 26 4 24 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
        <path d="M32 9 C30 6 34 3 32 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
        <path d="M40 10 C38 7 42 4 40 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
        {/* Base plate */}
        <ellipse cx="32" cy="50" rx="18" ry="3" fill="currentColor" opacity="0.1" />
      </svg>
    ),
    bg: "bg-[#F5F5F0]",
    accent: "border-stone-400/40",
    accentText: "text-stone-600",
    accentDot: "bg-stone-500",
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-emerald-800 font-sans tracking-[0.2em] text-xs md:text-sm uppercase block mb-4">
            What We Offer
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-emerald-950">
            Our Collections
          </h2>
        </motion.div>

        {/* Three category cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-stone-200">
          {CATEGORIES.map((cat, index) => (
            <motion.a
              key={cat.id}
              href="#products"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("products");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`group relative flex flex-col p-8 md:p-10 cursor-pointer transition-all duration-300 no-underline
                ${cat.bg}
                ${cat.dark ? "text-stone-100" : "text-emerald-950"}
                ${index < CATEGORIES.length - 1 ? "md:border-r border-b md:border-b-0 border-stone-200" : ""}
              `}
            >
              {/* Large background number */}
              <span
                className={`absolute top-6 right-8 font-serif text-7xl font-bold leading-none select-none pointer-events-none transition-opacity duration-300 group-hover:opacity-15 ${
                  cat.dark ? "text-white/5" : "text-emerald-950/5"
                }`}
              >
                {cat.label}
              </span>

              {/* Icon */}
              <div
                className={`mb-8 transition-transform duration-300 group-hover:-translate-y-1 ${
                  cat.dark ? "text-emerald-300" : "text-emerald-900"
                }`}
              >
                {cat.icon}
              </div>

              {/* Content */}
              <div className="flex-grow">
                <p
                  className={`font-sans text-xs tracking-[0.2em] uppercase mb-2 ${cat.accentText} ${cat.dark ? "opacity-80" : ""}`}
                >
                  {cat.subtitle}
                </p>
                <h3
                  className={`font-serif text-2xl md:text-3xl mb-4 leading-tight ${
                    cat.dark ? "text-white" : "text-emerald-950"
                  }`}
                >
                  {cat.title}
                </h3>
                <p
                  className={`font-sans text-sm leading-relaxed mb-8 ${
                    cat.dark ? "text-stone-300" : "text-stone-500"
                  }`}
                >
                  {cat.description}
                </p>

                {/* Item list */}
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cat.accentDot}`}
                      />
                      <span
                        className={`font-sans text-xs tracking-wide ${
                          cat.dark ? "text-stone-300" : "text-stone-500"
                        }`}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer link */}
              <div
                className={`mt-10 pt-6 border-t flex items-center justify-between ${
                  cat.dark ? "border-emerald-900/40" : "border-stone-200"
                }`}
              >
                <span
                  className={`font-sans text-xs tracking-widest uppercase transition-colors ${
                    cat.dark
                      ? "text-emerald-400 group-hover:text-emerald-300"
                      : "text-emerald-800 group-hover:text-emerald-600"
                  }`}
                >
                  Explore Products
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${
                    cat.dark ? "text-emerald-400" : "text-emerald-800"
                  }`}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
