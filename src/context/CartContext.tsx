"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/types";
import { trackAddToCart, trackRemoveFromCart } from "@/lib/analytics";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price?: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalValue: number;
  isOpen: boolean;
  addItem: (product: Pick<Product, "id" | "name" | "image" | "price" | "tag">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "dhrubotara:cart:v1";

export function parsePriceToNumber(price?: string): number {
  if (!price) return 0;
  // Extract the first numeric token so strings like "Rs. 350 / 500ml" or
  // "₹350 (500g)" don't concatenate digits across price and weight.
  const match = price.match(/\d+(?:\.\d+)?/);
  if (!match) return 0;
  const parsed = parseFloat(match[0]);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let restored: CartItem[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          restored = parsed.filter(
            (entry): entry is CartItem =>
              typeof entry === "object" &&
              entry !== null &&
              typeof (entry as CartItem).id === "string" &&
              typeof (entry as CartItem).name === "string" &&
              typeof (entry as CartItem).quantity === "number"
          );
        }
      }
    } catch {
      // Ignore corrupted storage
    }
    // Hydrate from localStorage — canonical "sync external state into React"
    // case the effect rule warns about.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (restored.length > 0) setItems(restored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore quota errors
    }
  }, [items, hydrated]);

  const addItem = useCallback<CartContextValue["addItem"]>((product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: 1,
        },
      ];
    });
    trackAddToCart({
      id: product.id,
      name: product.name,
      category: product.tag,
      price: parsePriceToNumber(product.price),
      quantity: 1,
      currency: "INR",
    });
  }, []);

  const removeItem = useCallback<CartContextValue["removeItem"]>((id) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        trackRemoveFromCart({
          id: target.id,
          name: target.name,
          price: parsePriceToNumber(target.price),
          quantity: target.quantity,
          currency: "INR",
        });
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const updateQuantity = useCallback<CartContextValue["updateQuantity"]>((id, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((open) => !open), []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalValue = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + parsePriceToNumber(item.price) * item.quantity,
        0
      ),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      totalValue,
      isOpen,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      openCart,
      closeCart,
      toggleCart,
    }),
    [
      items,
      totalItems,
      totalValue,
      isOpen,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      openCart,
      closeCart,
      toggleCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
