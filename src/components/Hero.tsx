"use client";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { Leaf, Tree } from "./ui/Botanical";

const STATS = [
  { value: "100%", label: "Natural" },
  { value: "Traditional", label: "Recipes" },
  { value: "Bengal", label: "Heritage" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FBF6E9]">
      {/* Texture overlay */}
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />

      {/* Decorative botanical left */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-24 md:w-40 h-64 md:h-96 text-emerald-900 pointer-events-none hidden sm:block"
        style={{ marginLeft: "-2rem" }}
      >
        <Leaf className="w-full h-full" />
      </motion.div>

      {/* Decorative botanical right (mirrored) */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-24 md:w-40 h-64 md:h-96 text-emerald-900 pointer-events-none hidden sm:block"
        style={{ marginRight: "-2rem", transform: "translateY(-50%) scaleX(-1)" }}
      >
        <Leaf className="w-full h-full" />
      </motion.div>

      {/* Trees flanking the bottom corners */}
      <div className="absolute left-2 bottom-0 w-32 md:w-44 h-40 md:h-56 text-emerald-900 pointer-events-none hidden md:block">
        <Tree className="w-full h-full" />
      </div>
      <div className="absolute right-2 bottom-0 w-32 md:w-44 h-40 md:h-56 text-emerald-900 pointer-events-none hidden md:block" style={{ transform: "scaleX(-1)" }}>
        <Tree className="w-full h-full" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-px w-8 md:w-12 bg-emerald-900/30" />
          <p className="text-emerald-800 font-sans tracking-[0.2em] text-xs md:text-sm uppercase font-medium">
            Pure • Homely • Authentic
          </p>
          <div className="h-px w-8 md:w-12 bg-emerald-900/30" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-emerald-950 mb-6 leading-[1.1]"
        >
          Natural Products{" "}
          <span className="italic font-light text-emerald-800">Thoughtfully</span>
          <br />
          Crafted{" "}
          <span className="italic font-light">For You</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-emerald-900/70 font-serif italic text-lg md:text-2xl mb-10"
        >
          Simple, reliable, &amp; Authentic From The Heart of Bengal
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="https://wa.me/919831574424?text=Hi%2C%20I%20would%20like%20to%20place%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-900 text-stone-50 px-8 py-3.5 rounded-sm font-sans text-sm tracking-wide hover:bg-emerald-800 transition-all active:scale-95 inline-flex items-center gap-2 shadow-lg shadow-emerald-900/20"
            onClick={() => trackEvent("whatsapp_click", { location: "hero_cta" })}
          >
            <span className="text-base">💬</span> Order via WhatsApp
          </a>
          <button
            onClick={() => {
              const el = document.getElementById("products");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-emerald-900 font-sans text-sm tracking-wide border border-emerald-900/30 px-8 py-3.5 rounded-sm hover:bg-emerald-900/5 transition-all active:scale-95 cursor-pointer"
          >
            Explore Collection
          </button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center gap-0 border-t border-emerald-900/10 pt-8"
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              <div className="px-6 md:px-10 text-center">
                <p className="font-serif text-xl md:text-2xl text-emerald-950 font-medium">
                  {stat.value}
                </p>
                <p className="font-sans text-xs text-stone-500 tracking-widest uppercase mt-1">
                  {stat.label}
                </p>
              </div>
              {i < STATS.length - 1 && (
                <div className="h-8 w-px bg-emerald-900/15" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
