"use client";
import { Mail, Phone, Instagram, Facebook } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export function Footer() {
  return (
    <footer id="contact" className="bg-emerald-950 text-stone-300 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
          
          <div>
            <span className="font-serif text-3xl text-stone-100 block mb-6">dhrubotara</span>
            <p className="font-sans text-sm leading-relaxed max-w-xs mx-auto md:mx-0 text-stone-400">
              Bringing the purity of nature and the warmth of tradition to your home. Authentic goods, crafted with love.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-4">
            <h4 className="font-serif text-lg text-stone-100 mb-2">Contact Us</h4>
            <a
              href="mailto:hello@dhrubotara.com"
              className="flex items-center space-x-3 hover:text-white transition-colors"
              onClick={() => trackEvent('contact_click', { method: 'email' })}
            >
              <Mail size={18} />
              <span>hello@dhrubotara.com</span>
            </a>
            <a
              href="tel:+919831574424"
              className="flex items-center space-x-3 hover:text-white transition-colors"
              onClick={() => trackEvent('contact_click', { method: 'phone' })}
            >
              <Phone size={18} />
              <span>+91 98315 74424</span>
            </a>
          </div>

          <div className="flex flex-col items-center md:items-start">
             <h4 className="font-serif text-lg text-stone-100 mb-6">Follow Our Journey</h4>
             <div className="flex space-x-6">
               <a href="#" className="hover:text-white transition-colors"><Instagram size={24} /></a>
               <a href="#" className="hover:text-white transition-colors"><Facebook size={24} /></a>
             </div>
          </div>

        </div>

        <div className="border-t border-emerald-900 mt-16 pt-8 text-center text-xs text-stone-500 font-sans tracking-wider">
          Handcrafted with love & tradition. &copy; {new Date().getFullYear()} Dhrubotara.
        </div>
      </div>
    </footer>
  );
}
