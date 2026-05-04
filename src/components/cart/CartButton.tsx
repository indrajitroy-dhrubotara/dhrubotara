"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { trackEvent } from "@/lib/analytics";

interface CartButtonProps {
  variant?: "navbar" | "mobile";
}

export function CartButton({ variant = "navbar" }: CartButtonProps) {
  const { totalItems, openCart } = useCart();

  const handleClick = () => {
    trackEvent("cart_open", { location: variant, items: totalItems });
    openCart();
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Open cart${totalItems > 0 ? ` (${totalItems} item${totalItems === 1 ? "" : "s"})` : ""}`}
      className="relative p-2 text-stone-100 hover:text-amber-200 active:scale-95 transition cursor-pointer"
    >
      <ShoppingBag size={22} />
      {totalItems > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-300 text-emerald-950 text-[10px] font-sans font-semibold flex items-center justify-center leading-none"
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
