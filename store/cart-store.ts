"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductSize } from "@/types/product";

const BUY_NOW_STORAGE_KEY = "KOTA_KARIGARI_BUY_NOW_ITEM";
const BUY_NOW_LOCAL_STORAGE_KEY = "KOTA_KARIGARI_BUY_NOW_ITEM_LOCAL";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  size: ProductSize;
  price: number;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  notice: string | null;
  buyNowItem: CartItem | null;
  checkoutMode: "cart" | "buyNow";
  addItem: (product: Product, size: ProductSize, quantity?: number) => void;
  setBuyNowItem: (product: Product, size: ProductSize, quantity?: number) => void;
  setCartCheckoutMode: () => void;
  removeItem: (productId: string, size: ProductSize) => void;
  increase: (productId: string, size: ProductSize) => void;
  decrease: (productId: string, size: ProductSize) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  openCart: () => void;
  closeCart: () => void;
  clearNotice: () => void;
  clearBuyNowItem: () => void;
}

const persistBuyNowItem = (item: CartItem | null) => {
  if (typeof window === "undefined") return;

  if (!item) {
    window.sessionStorage.removeItem(BUY_NOW_STORAGE_KEY);
    window.localStorage.removeItem(BUY_NOW_LOCAL_STORAGE_KEY);
    return;
  }

  // Save to both sessionStorage and localStorage for redundancy
  window.sessionStorage.setItem(BUY_NOW_STORAGE_KEY, JSON.stringify(item));
  window.localStorage.setItem(BUY_NOW_LOCAL_STORAGE_KEY, JSON.stringify(item));
};

export const createCartItem = (
  product: Product,
  size: ProductSize,
  quantity = 1
) => {
  const sizeStock =
    product.sizeInventory.find((item) => item.size === size)?.stock ??
    product.stock;

  if (product.stock <= 0 || sizeStock <= 0) {
    return null;
  }

  return {
    productId: product.id,
    name: product.name,
    image: product.images[0],
    size,
    price: product.discountPrice ?? product.price,
    quantity: Math.min(quantity, sizeStock),
    stock: sizeStock
  } satisfies CartItem;
};

export const saveBuyNowItem = (item: CartItem | null) => {
  persistBuyNowItem(item);
};

export const getStoredBuyNowItem = () => {
  if (typeof window === "undefined") return null;

  // Try sessionStorage first
  const rawSession = window.sessionStorage.getItem(BUY_NOW_STORAGE_KEY);
  if (rawSession) {
    try {
      return JSON.parse(rawSession) as CartItem;
    } catch {
      window.sessionStorage.removeItem(BUY_NOW_STORAGE_KEY);
    }
  }

  // Fallback to localStorage if sessionStorage is empty
  const rawLocal = window.localStorage.getItem(BUY_NOW_LOCAL_STORAGE_KEY);
  if (rawLocal) {
    try {
      const item = JSON.parse(rawLocal) as CartItem;
      // Restore to sessionStorage for consistency
      window.sessionStorage.setItem(BUY_NOW_STORAGE_KEY, rawLocal);
      return item;
    } catch {
      window.localStorage.removeItem(BUY_NOW_LOCAL_STORAGE_KEY);
    }
  }

  return null;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      notice: null,
      buyNowItem: null,
      checkoutMode: "cart",
      addItem: (product, size, quantity = 1) =>
        set((state) => {
          if (product.stock <= 0) return state;

          const existing = state.items.find(
            (item) => item.productId === product.id && item.size === size
          );
          const sizeStock =
            product.sizeInventory.find((item) => item.size === size)?.stock ??
            product.stock;

          if (existing) {
            return {
              notice: "Added to cart",
              items: state.items.map((item) =>
                item.productId === product.id && item.size === size
                  ? {
                      ...item,
                      quantity: Math.min(item.quantity + quantity, sizeStock)
                    }
                  : item
              )
            };
          }

          return {
            notice: "Added to cart",
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                image: product.images[0],
                size,
                price: product.discountPrice ?? product.price,
                quantity: Math.min(quantity, sizeStock),
                stock: sizeStock
              }
            ]
          };
        }),
      setBuyNowItem: (product, size, quantity = 1) =>
        set(() => {
          const item = createCartItem(product, size, quantity);

          if (!item) {
            persistBuyNowItem(null);
            return { buyNowItem: null, checkoutMode: "cart" };
          }

          persistBuyNowItem(item);

          return {
            checkoutMode: "buyNow",
            buyNowItem: item
          };
        }),
      setCartCheckoutMode: () => {
        persistBuyNowItem(null);
        set({ checkoutMode: "cart", buyNowItem: null });
      },
      removeItem: (productId, size) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.size === size)
          )
        })),
      increase: (productId, size) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
              : item
          )
        })),
      decrease: (productId, size) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.productId === productId && item.size === size
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0)
        })),
      clearCart: () => set({ items: [] }),
      setItems: (items) => set({ items }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      clearNotice: () => set({ notice: null }),
      clearBuyNowItem: () => {
        persistBuyNowItem(null);
        set({ buyNowItem: null, checkoutMode: "cart" });
      }
    }),
    {
      name: "KOTA KARIGARI-cart",
      partialize: (state) => ({ items: state.items })
    }
  )
);

export const getCartSubtotal = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

export const getCartCount = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.quantity, 0);

export const mergeCartItems = (a: CartItem[], b: CartItem[]): CartItem[] => {
  const merged = new Map<string, CartItem>();

  for (const item of [...a, ...b]) {
    const key = `${item.productId}-${item.size}`;
    const existing = merged.get(key);

    merged.set(
      key,
      existing
        ? {
            ...existing,
            quantity: Math.min(
              existing.quantity + item.quantity,
              Math.max(existing.stock, item.stock)
            )
          }
        : item
    );
  }

  return Array.from(merged.values());
};