"use client";
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { FadeInImage } from './ui/FadeInImage';
import { trackEvent } from '@/lib/analytics';

export function CustomHamper() {
  const products = [
    { name: "Mixed Vegetable Pickle", details: "225 gms", price: "Rs. 200" },
    { name: "Aam Gur", details: "225 gms", price: "Rs. 350" },
    { name: "Aam Kasundi", details: "225 gms", price: "Rs. 300" },
    { name: "Shrimp Balachaung", details: "200 gms", price: "Rs. 400" },
    { name: "Spiced Honey", details: "Sabar communities of Sunderbans, 200 gms", price: "Rs. 300" },
    { name: "Binola Ghee", details: "Villages of Birbhum", price: "Rs. 400" },
    { name: "Bori (Goyna, Masala, Hing)", details: "Made by women in West Midnapore", price: "Rs. 100/pkt" },
    { name: "Choshi", details: "Made by women in W Midnapore", price: "Rs. 100/pkt" },
  ];

  return (
    <section className="py-16 md:py-24 bg-emerald-950 text-stone-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-6 leading-tight">
              Customize Your Own Hamper <br />
              <span className="text-emerald-400/80 italic text-2xl md:text-4xl">and let us pack it for you.</span>
            </h2>
            
            <p className="text-stone-300 font-sans text-lg mb-8 leading-relaxed">
              Create a personalized gift of health and tradition. Choose from our authentic collection to build the perfect hamper for your loved ones.
            </p>

            <div className="bg-emerald-900/30 p-6 rounded-lg border border-emerald-800/50 backdrop-blur-sm mb-8">
              <h3 className="font-serif text-xl text-emerald-200 mb-4 border-b border-emerald-800/50 pb-2">Available for Hamper</h3>
              <ul className="space-y-3">
                {products.map((item, index) => (
                  <li key={index} className="flex justify-between items-start text-sm md:text-base border-b border-emerald-900/30 pb-2 last:border-0 last:pb-0">
                    <span className="text-stone-200 font-medium">
                      {item.name} 
                      {item.details && <span className="block text-xs text-stone-400 font-normal">{item.details}</span>}
                    </span>
                    <span className="text-emerald-300 font-semibold whitespace-nowrap ml-4">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
                <a
                  href="tel:9831574424"
                  className="flex items-center gap-3 bg-emerald-500 text-white px-8 py-3 rounded-full font-medium hover:bg-emerald-400 transition-colors duration-300 w-full sm:w-auto justify-center shadow-lg shadow-emerald-900/20"
                  onClick={() => trackEvent('phone_call_click', { location: 'hamper_button' })}
                >
                  <Phone className="w-5 h-5" />
                  Call to Customize
                </a>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-xs text-emerald-400 uppercase tracking-widest mb-1">Direct Line</span>
                  <a
                    href="tel:9831574424"
                    className="text-lg md:text-xl font-sans font-medium text-white hover:text-emerald-300 transition-colors select-all tracking-wider"
                    onClick={() => trackEvent('phone_call_click', { location: 'hamper_direct_number' })}
                  >
                    +91 98315 74424
                  </a>
                </div>
            </div>
          </motion.div>

          {/* Images — 2×2 grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="grid grid-cols-2 gap-3">
              {[
                { src: "/hamper-1.jpg", alt: "Hamper with Mixed Vegetable Pickle, Aam Gur & Aam Kasundi" },
                { src: "/hamper-2.jpg", alt: "Hamper with Goyna Bori, Masala Bori & jars" },
                { src: "/hamper-3.jpg", alt: "Wooden box hamper with Goyna Bori & Aam Kasundi" },
                { src: "/hamper-4.jpg", alt: "Hamper with Shrimp Balachaung, Goyna Bori & Mixed Pickle" },
              ].map((img) => (
                <div
                  key={img.src}
                  className="aspect-square relative overflow-hidden rounded-sm border border-emerald-800/30 shadow-lg"
                >
                  <FadeInImage
                    src={img.src}
                    fallbackSrc="/hamper.png"
                    alt={img.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-emerald-950/10 pointer-events-none" />
                </div>
              ))}
            </div>

            {/* Decorative glows */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-stone-500/10 rounded-full blur-3xl -z-10" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
