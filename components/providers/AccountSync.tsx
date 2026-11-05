"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchServerCart, saveServerCart } from "@/lib/cartApi";
import { getProductsByIds } from "@/lib/products";
import { fetchServerWishlist, saveServerWishlist } from "@/lib/wishlistApi";
import { createCartItem, mergeCartItems, useCartStore, type CartItem } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

const OWNER_KEY = "KOTA_KARIGARI_SYNC_OWNER";
const DEBOUNCE_MS = 600;

async function refreshCartItems(items: CartItem[]): Promise<CartItem[]> {
  if (items.length === 0) return items;

  try {
    const products = await getProductsByIds(items.map((item) => item.productId));
    const byId = new Map(products.map((product) => [product.id, product]));

    return items.flatMap((item) => {
      const product = byId.get(item.productId);
      if (!product) return [];
      const fresh = createCartItem(product, item.size, item.quantity);
      return fresh ? [fresh] : [];
    });
  } catch {
    return items; // offline or API error: keep what we have
  }
}

export function AccountSync() {
  const { user, loading } = useAuth();
  const userId = user?.$id ?? null;

  useEffect(() => {
    if (loading) return;

    if (!userId) {
      // signed out or session expired: don't leave a previous user's data here
      if (window.localStorage.getItem(OWNER_KEY)) {
        useCartStore.getState().setItems([]);
        useWishlistStore.getState().setItems([]);
        window.localStorage.removeItem(OWNER_KEY);
      }
      return;
    }

    let cancelled = false;
    let cartTimer: ReturnType<typeof setTimeout> | undefined;
    let wishlistTimer: ReturnType<typeof setTimeout> | undefined;
    let unsubscribeCart = () => {};
    let unsubscribeWishlist = () => {};

    (async () => {
      try {
        const owner = window.localStorage.getItem(OWNER_KEY);

        // ---- cart ----
        const localItems = useCartStore.getState().items;
        const serverItems = await fetchServerCart(userId);

        let cartItems: CartItem[];
        if (owner === null) {
          cartItems = mergeCartItems(serverItems ?? [], localItems); // guest -> account
        } else {
          cartItems = serverItems ?? (owner === userId ? localItems : []);
        }
        cartItems = await refreshCartItems(cartItems);

        // ---- wishlist ----
        const localIds = useWishlistStore.getState().items.map((product) => product.id);
        const serverIds = await fetchServerWishlist(userId);

        let wishlistIds: string[];
        if (owner === null) {
          wishlistIds = Array.from(new Set([...(serverIds ?? []), ...localIds]));
        } else {
          wishlistIds = serverIds ?? (owner === userId ? localIds : []);
        }

        let wishlistProducts = await getProductsByIds(wishlistIds).catch(() => null);
        if (wishlistProducts) {
          const byId = new Map(wishlistProducts.map((product) => [product.id, product]));
          wishlistProducts = wishlistIds.flatMap((id) => {
            const product = byId.get(id);
            return product ? [product] : [];
          });
        } else {
          wishlistProducts = useWishlistStore.getState().items; // API error: keep local
        }

        if (cancelled) return; // Strict Mode / user changed while loading

        useCartStore.getState().setItems(cartItems);
        useWishlistStore.getState().setItems(wishlistProducts);
        window.localStorage.setItem(OWNER_KEY, userId);

        // start pushing changes only after the initial pull
        unsubscribeCart = useCartStore.subscribe((state, prev) => {
          if (state.items === prev.items) return;
          clearTimeout(cartTimer);
          cartTimer = setTimeout(() => {
            saveServerCart(userId, state.items).catch(console.error);
          }, DEBOUNCE_MS);
        });

        unsubscribeWishlist = useWishlistStore.subscribe((state, prev) => {
          if (state.items === prev.items) return;
          clearTimeout(wishlistTimer);
          wishlistTimer = setTimeout(() => {
            saveServerWishlist(
              userId,
              state.items.map((product) => product.id)
            ).catch(console.error);
          }, DEBOUNCE_MS);
        });

        // first time on this device for this user: write the merged result back
        if (owner !== userId) {
          saveServerCart(userId, cartItems).catch(console.error);
          saveServerWishlist(userId, wishlistProducts.map((product) => product.id)).catch(console.error);
        }
      } catch (error) {
        console.error("Account sync failed", error);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(cartTimer);
      clearTimeout(wishlistTimer);
      unsubscribeCart();
      unsubscribeWishlist();
    };
  }, [userId, loading]);

  return null;
}