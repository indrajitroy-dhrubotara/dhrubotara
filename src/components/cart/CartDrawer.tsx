"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useCart, parsePriceToNumber } from "@/context/CartContext";
import { FadeInImage } from "@/components/ui/FadeInImage";
import { trackBeginCheckout, trackEvent } from "@/lib/analytics";

const WHATSAPP_NUMBER = "919831574424";

function buildWhatsAppMessage(items: ReturnType<typeof useCart>["items"], total: number) {
  const lines = [
    "Hi, I'd like to place an order:",
    "",
    ...items.map((item, index) => {
      const price = parsePriceToNumber(item.price);
      const subtotal = price * item.quantity;
      const priceLabel = price > 0
        ? ` — ₹${subtotal.toFixed(0)} (${item.quantity} × ${item.price})`
        : ` — qty ${item.quantity}`;
      return `${index + 1}. ${item.name}${priceLabel}`;
    }),
  ];
  if (total > 0) {
    lines.push("", `Estimated total: ₹${total.toFixed(0)} (delivery charges not included)`);
  }
  lines.push("", "Please confirm availability and delivery charges. Thank you!");
  return lines.join("\n");
}

export function CartDrawer() {
  const {
    items,
    totalItems,
    totalValue,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
  } = useCart();

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  const whatsAppHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildWhatsAppMessage(items, totalValue)
  )}`;

  const handleCheckout = () => {
    trackBeginCheckout({
      value: totalValue,
      currency: "INR",
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: parsePriceToNumber(item.price),
        quantity: item.quantity,
      })),
    });
    trackEvent("whatsapp_click", { location: "cart_checkout" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-emerald-950/40 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden="true"
          />
          <motion.aside
            key="cart-drawer"
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 right-0 z-[70] h-full w-full sm:w-[420px] bg-[#FBF6E9] shadow-2xl flex flex-col"
          >
            <header className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-emerald-900" />
                <h2 className="font-serif text-xl text-emerald-950">
                  Your Cart
                  {totalItems > 0 && (
                    <span className="ml-2 text-sm font-sans text-stone-500">
                      ({totalItems})
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="p-2 -mr-2 text-stone-500 hover:text-emerald-900 active:scale-95 transition"
              >
                <X size={22} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                  <ShoppingBag size={40} className="text-stone-300 mb-4" />
                  <p className="font-serif text-xl text-emerald-950 mb-2">
                    Your cart is empty
                  </p>
                  <p className="font-sans text-sm text-stone-500 mb-6">
                    Browse the collection and add the items you&apos;d like to order.
                  </p>
                  <Link
                    href="/#products"
                    onClick={closeCart}
                    className="bg-emerald-900 hover:bg-emerald-800 text-stone-50 px-6 py-3 rounded-sm font-sans text-sm tracking-wide transition active:scale-95"
                  >
                    Explore Products
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => {
                    const price = parsePriceToNumber(item.price);
                    const subtotal = price * item.quantity;
                    return (
                      <li
                        key={item.id}
                        className="flex gap-3 bg-white p-3 rounded-sm shadow-sm"
                      >
                        <div className="relative w-20 h-20 flex-shrink-0 bg-stone-100 overflow-hidden">
                          <FadeInImage
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            containerClassName="w-full h-full"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <Link
                              href={`/product/${item.id}`}
                              onClick={closeCart}
                              className="font-serif text-base text-emerald-950 hover:text-emerald-700 transition leading-tight block truncate"
                            >
                              {item.name}
                            </Link>
                            {item.price && (
                              <p className="font-sans text-xs text-stone-500 mt-0.5">
                                {item.price}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="inline-flex items-center border border-stone-200 rounded-sm">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                aria-label={`Decrease quantity of ${item.name}`}
                                className="p-1.5 text-stone-600 hover:text-emerald-900 active:scale-95 transition"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-sans text-sm w-8 text-center text-emerald-950">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                aria-label={`Increase quantity of ${item.name}`}
                                className="p-1.5 text-stone-600 hover:text-emerald-900 active:scale-95 transition"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <div className="flex items-center gap-3">
                              {price > 0 && (
                                <span className="font-sans text-sm font-medium text-emerald-800">
                                  ₹{subtotal.toFixed(0)}
                                </span>
                              )}
                              <button
                                onClick={() => removeItem(item.id)}
                                aria-label={`Remove ${item.name} from cart`}
                                className="text-stone-400 hover:text-red-600 active:scale-95 transition p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-stone-200 px-5 py-4 bg-white">
                {totalValue > 0 && (
                  <div className="mb-3 font-sans">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-500">Estimated total</span>
                      <span className="text-lg font-medium text-emerald-950">
                        ₹{totalValue.toFixed(0)}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-stone-500">
                      Delivery charges not included &mdash; we&apos;ll confirm them on WhatsApp.
                    </p>
                  </div>
                )}
                <a
                  href={whatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCheckout}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3.5 rounded-sm font-sans text-sm tracking-wide transition active:scale-95 shadow-lg shadow-emerald-900/20"
                >
                  <MessageCircle size={18} />
                  Order via WhatsApp
                </a>
                <p className="mt-2 text-center text-[11px] text-stone-400 font-sans leading-relaxed">
                  We&apos;ll confirm availability and delivery on WhatsApp before payment.
                </p>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
