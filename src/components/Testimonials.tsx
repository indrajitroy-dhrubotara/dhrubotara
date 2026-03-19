"use client";
import { motion } from "framer-motion";
import { useTestimonials } from "../lib/useTestimonials";
import { Skeleton } from "./ui/Skeleton";

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-3.5 h-3.5 text-amber-400"
        >
          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
        </svg>
      ))}
    </div>
  );
}

const ACCENT_COLORS = [
  "border-emerald-600",
  "border-amber-500",
  "border-stone-400",
];

export function Testimonials() {
  const { testimonials, loading } = useTestimonials();

  return (
    <section id="testimonials" className="py-24 bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-emerald-800 font-sans tracking-[0.2em] text-sm uppercase block mb-4">
            Words of Trust
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-emerald-950">
            Stories of Healing
          </h2>
          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-12 bg-emerald-900/20" />
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-emerald-800/40" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
              <path d="M12 6a1 1 0 0 1 1 1v4.586l2.707 2.707a1 1 0 0 1-1.414 1.414l-3-3A1 1 0 0 1 11 12V7a1 1 0 0 1 1-1z" />
            </svg>
            <div className="h-px w-12 bg-emerald-900/20" />
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white p-8 shadow-sm flex flex-col h-full border-l-2 border-stone-200"
              >
                <Skeleton className="h-3.5 w-20 mb-4" />
                <Skeleton className="h-5 w-24 mb-6" />
                <Skeleton className="h-24 w-full mb-6" />
                <div className="flex items-center mt-auto pt-4 border-t border-stone-100">
                  <Skeleton className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`bg-white p-8 shadow-sm relative flex flex-col h-full border-l-2 ${
                  ACCENT_COLORS[index % ACCENT_COLORS.length]
                }`}
              >
                <div className="relative z-10 flex-grow">
                  {/* Stars */}
                  <StarRating />

                  {t.category && (
                    <span className="inline-block px-2 py-1 mb-4 text-[10px] font-sans font-bold tracking-widest uppercase bg-emerald-50 text-emerald-900">
                      {t.category}
                    </span>
                  )}

                  {/* Large opening quote */}
                  <span className="font-serif text-5xl text-emerald-900/10 leading-none block -mb-3">
                    &ldquo;
                  </span>
                  <p className="text-stone-600 font-serif italic text-base leading-relaxed mb-6">
                    {t.text}
                  </p>
                </div>

                <div className="flex items-center mt-4 pt-4 border-t border-stone-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-900 text-stone-50 flex items-center justify-center font-serif text-lg mr-3 flex-shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-sans font-medium text-emerald-950 text-sm">
                      {t.name}
                    </h4>
                    {t.role && (
                      <p className="text-stone-400 text-xs uppercase tracking-wider">
                        {t.role}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-stone-400 py-10 font-serif italic">
            No testimonials yet.
          </div>
        )}
      </div>
    </section>
  );
}
