"use client";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

function LeafLeft() {
  return (
    <svg
      viewBox="0 0 120 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path
        d="M60 190 C60 190 10 140 20 80 C30 20 60 10 60 10 C60 10 90 20 100 80 C110 140 60 190 60 190Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M60 10 L60 190"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
      />
      <path d="M60 50 C40 60 30 80 35 100" stroke="currentColor" strokeWidth="0.8" opacity="0.15" fill="none" />
      <path d="M60 70 C80 80 90 100 85 120" stroke="currentColor" strokeWidth="0.8" opacity="0.15" fill="none" />
      <path d="M60 90 C40 100 32 118 37 138" stroke="currentColor" strokeWidth="0.8" opacity="0.15" fill="none" />
      <path d="M60 110 C80 120 88 138 83 158" stroke="currentColor" strokeWidth="0.8" opacity="0.15" fill="none" />
    </svg>
  );
}

const STATS = [
  { value: "100%", label: "Natural" },
  { value: "∞", label: "Traditions" },
  { value: "Bengal", label: "Heritage" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F5F5F0]">
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
        <LeafLeft />
      </motion.div>

      {/* Decorative botanical right (mirrored) */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-24 md:w-40 h-64 md:h-96 text-emerald-900 pointer-events-none hidden sm:block"
        style={{ marginRight: "-2rem", transform: "translateY(-50%) scaleX(-1)" }}
      >
        <LeafLeft />
      </motion.div>

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
          Authentic{" "}
          <span className="italic font-light text-emerald-800">Natural</span>
          <br />
          Remedies &amp; Artisanal
          <br />
          <span className="italic font-light">Foods</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-emerald-900/70 font-serif italic text-lg md:text-2xl mb-10"
        >
          From the heart of Bengal
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-emerald-900/40">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-6 bg-emerald-900/30"
        />
      </motion.div>
    </section>
  );
}
