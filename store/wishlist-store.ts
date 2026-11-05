"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";

interface WishlistState {
  items: Product[];

  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  setItems: (items: Product[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
            setItems: (items) => set({ items }),

      addItem: (product) =>
        set((state) => {
          const exists = state.items.some(
            (item) => item.id === product.id
          );

          if (exists) return state;

          return {
            items: [...state.items, product],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.id !== productId
          ),
        })),

      toggleItem: (product) => {
        const exists = get().items.some(
          (item) => item.id === product.id
        );

        if (exists) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isWishlisted: (productId) =>
        get().items.some(
          (item) => item.id === productId
        ),
    }),
    {
      name: "KOTA KARIGARI-wishlist",
    }
  )
);

export const getWishlistCount = (
  items: Product[]
) => items.length;