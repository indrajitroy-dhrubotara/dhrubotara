"use client";

import { motion } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { trackEvent } from '@/lib/analytics';
import { useCart } from '@/context/CartContext';

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
  const { totalItems, openCart } = useCart();

  const handleCartClick = () => {
    trackEvent('cart_open', { source: 'navbar' });
    openCart();
  };

  const handleNavClick = (href: string, isPage: boolean, label: string) => {
    setIsOpen(false);
    trackEvent('navigation_click', { link_name: label.toLowerCase(), href });

    if (isPage) {
      router.push(href);
    } else {
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
    <nav className="fixed top-0 w-full z-50 bg-emerald-900/95 backdrop-blur-md border-b border-emerald-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Left: logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={handleLogoClick}>
            <Image
              src="/logo.svg"
              alt="Dhrubotara"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>

          {/* Right: nav links (desktop) + hamburger (mobile) */}
          <div className="flex items-center gap-2">
            {/* Desktop nav links */}
            <div className="hidden md:flex items-center space-x-8">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href, item.isPage, item.label)}
                  className={`relative text-stone-100 hover:text-amber-200 transition-colors font-sans text-sm tracking-wide uppercase bg-transparent border-none cursor-pointer group ${
                    pathname === item.href ? 'text-amber-200 font-medium' : ''
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-amber-200 transition-all duration-300 ${
                    pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </button>
              ))}
              <a
                href="https://wa.me/919831574424?text=Hi%2C%20I%20would%20like%20to%20place%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-emerald-950 px-6 py-2 rounded-sm font-sans text-sm tracking-wide hover:bg-stone-100 transition-all cursor-pointer active:scale-95 inline-block text-center no-underline font-medium"
                onClick={() => trackEvent('whatsapp_click', { location: 'navbar_desktop' })}
              >
                Order via WhatsApp
              </a>
            </div>

            {/* Cart button (always visible) */}
            <button
              onClick={handleCartClick}
              className="relative text-stone-100 hover:text-amber-200 p-2 ml-2 cursor-pointer active:scale-95 transition-colors"
              aria-label={`Open cart (${totalItems} items)`}
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-300 text-emerald-950 text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center leading-none">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-stone-100 hover:text-amber-200 p-2 cursor-pointer active:scale-95"
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
        className="md:hidden overflow-hidden bg-emerald-900 border-b border-emerald-950/40"
      >
        <div className="px-4 pt-4 pb-8 space-y-2 flex flex-col items-center">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href, item.isPage, item.label)}
              className={`text-stone-100 hover:text-amber-200 block px-6 py-3 text-lg font-medium w-full text-center active:bg-emerald-950 rounded-sm bg-transparent border-none cursor-pointer ${
                pathname === item.href ? 'text-amber-200 font-medium' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
          <a
            href="https://wa.me/919831574424?text=Hi%2C%20I%20would%20like%20to%20place%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white text-emerald-950 px-6 py-4 mt-6 rounded-sm font-sans text-base tracking-wide font-medium active:scale-95 transition-all text-center block cursor-pointer no-underline"
            onClick={() => trackEvent('whatsapp_click', { location: 'navbar_mobile' })}
          >
            Order via WhatsApp
          </a>
        </div>
      </motion.div>
    </nav>
  );
}
