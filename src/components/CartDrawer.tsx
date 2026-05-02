"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart, type CartItem } from "@/context/CartContext";
import { trackEvent } from "@/lib/analytics";

const parsePrice = (price?: string): number => {
  if (!price) return 0;
  const match = price.match(/[\d,]+(\.\d+)?/);
  return match ? parseFloat(match[0].replace(/,/g, "")) : 0;
};

const formatINR = (n: number) => `Rs. ${n.toLocaleString("en-IN")}`;

const buildWhatsAppMessage = (items: CartItem[], total: number) => {
  const lines = ["Hi, I would like to order:", ""];
  items.forEach((item) => {
    const unit = parsePrice(item.price);
    const subtotal = unit * item.quantity;
    const priceStr = unit > 0 ? ` — ${formatINR(subtotal)}` : "";
    lines.push(`• ${item.quantity} × ${item.name}${priceStr}`);
  });
  if (total > 0) {
    lines.push("", `Total: ${formatINR(total)}`);
  }
  return encodeURIComponent(lines.join("\n"));
};

export function CartDrawer() {
  const { items, totalItems, isOpen, closeCart, removeItem, updateQuantity, clearCart } = useCart();

  const total = items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);

  const handleCheckout = () => {
    trackEvent("cart_checkout", { item_count: totalItems, total_value: total });
    const message = buildWhatsAppMessage(items, total);
    window.open(`https://wa.me/919831574424?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-emerald-950/50 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#FBF6E9] z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-emerald-900 text-stone-50">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <h2 className="font-serif text-xl tracking-wide">Your Cart</h2>
                {totalItems > 0 && (
                  <span className="text-xs bg-stone-50 text-emerald-900 px-2 py-0.5 rounded-full font-medium">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-1 hover:text-amber-200 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </header>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={48} className="text-stone-300 mb-4" />
                  <p className="font-serif text-xl text-emerald-950 mb-2">Your cart is empty</p>
                  <p className="font-sans text-sm text-stone-500 max-w-xs">
                    Browse our collection and add items you&apos;d like to order.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-6 px-6 py-2.5 border border-emerald-900 text-emerald-900 rounded-sm text-sm tracking-wide hover:bg-emerald-900 hover:text-stone-50 transition-all cursor-pointer"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((item) => {
                    const unit = parsePrice(item.price);
                    const subtotal = unit * item.quantity;
                    return (
                      <li key={item.id} className="flex gap-4 pb-5 border-b border-stone-200 last:border-b-0">
                        <div className="relative w-20 h-20 flex-shrink-0 bg-stone-100 rounded-sm overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-serif text-base text-emerald-950 leading-tight">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-stone-400 hover:text-red-500 transition-colors cursor-pointer flex-shrink-0"
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          {item.price && (
                            <p className="text-sm text-emerald-800 font-medium mt-1">{item.price}</p>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-stone-300 rounded-sm">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1.5 hover:bg-stone-100 transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-3 text-sm font-medium tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-stone-100 transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            {unit > 0 && (
                              <span className="text-sm text-stone-600 font-medium">
                                {formatINR(subtotal)}
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <footer className="border-t border-stone-200 px-6 py-5 bg-white space-y-4">
                {total > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-lg text-emerald-950">Total</span>
                    <span className="font-serif text-xl text-emerald-950 font-medium">
                      {formatINR(total)}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-emerald-900 text-stone-50 px-6 py-3.5 rounded-sm font-sans text-sm tracking-wide hover:bg-emerald-800 transition-all active:scale-95 inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="text-base">💬</span> Order via WhatsApp
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-stone-500 text-xs tracking-wide uppercase hover:text-red-500 transition-colors cursor-pointer"
                >
                  Clear Cart
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
