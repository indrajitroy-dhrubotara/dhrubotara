"use client";

import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

const NAV_ITEMS = [
  { label: 'Story', href: '/story', isPage: true },
  { label: 'Products', href: '/#products', isPage: false },
  { label: 'Testimonials', href: '/#testimonials', isPage: false },
  { label: 'Contact', href: '/#contact', isPage: false },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (href: string, isPage: boolean, label: string) => {
    setIsOpen(false);
    trackEvent('navigation_click', { link_name: label.toLowerCase(), href });
    
    if (isPage) {
      // For page navigation, use router.push
      router.push(href);
    } else {
      // For hash navigation on home page
      const targetId = href.replace('/#', '');
      
      if (pathname !== '/') {
        router.push('/');
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  };

  const handleLogoClick = () => {
    setIsOpen(false);
    router.push('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={handleLogoClick}>
             {/* If we click logo, go top */}
            <span className="font-serif text-2xl text-emerald-950 tracking-wider">dhrubotara</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href, item.isPage, item.label)}
                className={`text-stone-600 hover:text-emerald-900 transition-colors font-sans text-sm tracking-wide uppercase bg-transparent border-none cursor-pointer ${
                  pathname === item.href ? 'text-emerald-900 font-medium' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href="https://wa.me/919831574424?text=Hi%2C%20I%20would%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-900 text-stone-50 px-6 py-2 rounded-sm font-sans text-sm tracking-wide hover:bg-emerald-800 transition-all cursor-pointer active:scale-95 inline-block text-center no-underline"
              onClick={() => trackEvent('whatsapp_click', { location: 'navbar_desktop' })}
            >
              Order via WhatsApp
            </a>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-800 hover:text-emerald-900 p-2 cursor-pointer active:scale-95"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto" },
          closed: { opacity: 0, height: 0 }
        }}
        className="md:hidden overflow-hidden bg-stone-50 border-b border-stone-200"
      >
        <div className="px-4 pt-4 pb-8 space-y-2 flex flex-col items-center">
          {NAV_ITEMS.map((item) => (
             <button
              key={item.label}
              onClick={() => handleNavClick(item.href, item.isPage, item.label)}
              className={`text-stone-600 hover:text-emerald-900 block px-6 py-3 text-lg font-medium w-full text-center active:bg-stone-100 rounded-sm bg-transparent border-none cursor-pointer ${
                pathname === item.href ? 'text-emerald-900 font-medium' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
          <a
            href="https://wa.me/919831574424?text=Hi%2C%20I%20would%20like%20to%20place%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-950 text-stone-50 px-6 py-4 mt-6 rounded-sm font-sans text-base tracking-wide active:scale-95 transition-all text-center block cursor-pointer no-underline"
            onClick={() => trackEvent('whatsapp_click', { location: 'navbar_mobile' })}
          >
            Order via WhatsApp
          </a>
        </div>
      </motion.div>
    </nav>
  );
}
