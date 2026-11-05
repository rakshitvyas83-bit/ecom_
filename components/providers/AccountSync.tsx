"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchServerCart, saveServerCart } from "@/lib/cartApi";
import { getProductsByIds } from "@/lib/products";
import { fetchServerWishlist, saveServerWishlist } from "@/lib/wishlistApi";
import { createCartItem, mergeCartItems, useCartStore, type CartItem } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

const OWNER_KEY = "KOTA_KARIGARI_SYNC_OWNER";
const DEBOUNCE_MS = 250;

async function refreshCartItems(items: CartItem[]): Promise<CartItem[]> {
  if (items.length === 0) return items;

  try {
    const products = await getProductsByIds(items.map((item) => item.productId));
    const byId = new Map(products.map((product) => [product.id, product]));

    return items.flatMap((item) => {
      const product = byId.get(item.productId);
      if (!product) return [item];
      const fresh = createCartItem(product, item.size, item.quantity);
      return [fresh ?? item];
    });
  } catch {
    return items; // offline or API error: keep what we have
  }
}

function mergeSavedCartItems(serverItems: CartItem[], localItems: CartItem[]) {
  const merged = new Map(serverItems.map((item) => [`${item.productId}-${item.size}`, item]));
  for (const item of localItems) {
    const key = `${item.productId}-${item.size}`;
    const serverItem = merged.get(key);
    merged.set(
      key,
      serverItem
        ? { ...serverItem, quantity: Math.max(serverItem.quantity, item.quantity) }
        : item
    );
  }
  return Array.from(merged.values());
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
          cartItems =
            owner === userId
              ? mergeSavedCartItems(serverItems ?? [], localItems)
              : serverItems ?? [];
        }
        cartItems = await refreshCartItems(cartItems);

        // ---- wishlist ----
        const localIds = useWishlistStore.getState().items.map((product) => product.id);
        let serverIds: string[] | null = null;
        try {
          serverIds = await fetchServerWishlist(userId);
        } catch (error) {
          console.error("Wishlist sync failed; continuing cart sync.", error);
        }

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
        if (
          owner !== userId ||
          JSON.stringify(cartItems) !== JSON.stringify(serverItems ?? [])
        ) {
          await saveServerCart(userId, cartItems);
        }
        if (owner !== userId) {
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