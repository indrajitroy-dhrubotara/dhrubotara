"use client";
import Image from "next/image";
import { Mail, Phone, Instagram, Facebook, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function Footer() {
  return (
    <footer id="contact" className="bg-emerald-950 text-stone-300">
      {/* WhatsApp CTA banner */}
      <div className="border-b border-emerald-900/60 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="font-serif text-2xl md:text-3xl text-stone-100 mb-1">
              Ready to order?
            </p>
            <p className="font-sans text-sm text-stone-400 max-w-md">
              Message us on WhatsApp — we&apos;ll confirm availability and arrange delivery to your doorstep.
            </p>
          </div>
          <a
            href="https://wa.me/919831574424?text=Hi%2C%20I%20would%20like%20to%20place%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3.5 rounded-sm font-sans text-sm tracking-wide transition-all active:scale-95 shadow-lg shadow-emerald-900/30 whitespace-nowrap"
            onClick={() => trackEvent("whatsapp_click", { location: "footer_cta" })}
          >
            <MessageCircle size={18} />
            Order via WhatsApp
          </a>
        </div>
      </div>

      {/* Main footer content */}
      <div className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
            <div>
              <div className="flex justify-center md:justify-start mb-4">
                <Image
                  src="/logo.svg"
                  alt="Dhrubotara"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <p className="font-sans text-sm leading-relaxed max-w-xs mx-auto md:mx-0 text-stone-400">
                Bringing the purity of nature and the warmth of tradition to your home. Authentic goods, crafted with love.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-4">
              <h4 className="font-serif text-lg text-stone-100 mb-2">Contact Us</h4>
              <a
                href="mailto:susmitaseng@yahoo.com"
                className="flex items-center space-x-3 hover:text-white transition-colors"
                onClick={() => trackEvent("contact_click", { method: "email" })}
              >
                <Mail size={18} />
                <span>susmitaseng@yahoo.com</span>
              </a>
              <a
                href="tel:+919831574424"
                className="flex items-center space-x-3 hover:text-white transition-colors"
                onClick={() =>
                  trackEvent("contact_click", { method: "phone", contact: "susmita" })
                }
              >
                <Phone size={18} />
                <span>Susmita Sengupta &middot; +91 98315 74424</span>
              </a>
              <a
                href="tel:+919831092295"
                className="flex items-center space-x-3 hover:text-white transition-colors"
                onClick={() =>
                  trackEvent("contact_click", { method: "phone", contact: "anindita" })
                }
              >
                <Phone size={18} />
                <span>Anindita Dev &middot; +91 98310 92295</span>
              </a>
              <a
                href="tel:+916290795338"
                className="flex items-center space-x-3 hover:text-white transition-colors"
                onClick={() =>
                  trackEvent("contact_click", { method: "phone", contact: "indrani" })
                }
              >
                <Phone size={18} />
                <span>Indrani Roy &middot; +91 62907 95338</span>
              </a>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-serif text-lg text-stone-100 mb-6">Follow Our Journey</h4>
              <div className="flex space-x-6">
                <a
                  href="https://www.instagram.com/dhru_botara25?igsh=bjI3ZHBxdWZvdjEw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  onClick={() => trackEvent("social_click", { platform: "instagram" })}
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="https://www.facebook.com/share/1CWT6ezukh/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  onClick={() => trackEvent("social_click", { platform: "facebook" })}
                >
                  <Facebook size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-emerald-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-stone-500 font-sans tracking-wider">
          Handcrafted with love &amp; tradition. &copy; {new Date().getFullYear()} Dhrubotara.
        </div>
      </div>
    </footer>
  );
}
