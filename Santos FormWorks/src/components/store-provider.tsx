"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "@/lib/products";
type CartItem = { product: Product; quantity: number };
type Store = {
  items: CartItem[];
  add: (product: Product) => void;
  update: (id: string, delta: number) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  notice: string;
};
const StoreContext = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const add = (product: Product) => {
    setItems((current) => {
      const found = current.find((i) => i.product.id === product.id);
      return found
        ? current.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          )
        : [...current, { product, quantity: 1 }];
    });
    setNotice(`${product.name} added to your cart.`);
  };
  const update = (id: string, delta: number) =>
    setItems((current) =>
      current
        .map((i) =>
          i.product.id === id ? { ...i, quantity: i.quantity + delta } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  const toggleFavorite = (id: string) =>
    setFavorites((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  return (
    <StoreContext.Provider
      value={{ items, add, update, favorites, toggleFavorite, notice }}
    >
      {children}
      <div className="sr-only" role="status" aria-live="polite">
        {notice}
      </div>
    </StoreContext.Provider>
  );
}
export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("StoreProvider is required");
  return value;
}
