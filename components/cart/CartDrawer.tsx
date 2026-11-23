"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getCartSubtotal, useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/utils/format";

export function CartDrawer() {
  const { items, isOpen, closeCart, increase, decrease, removeItem, setCartCheckoutMode } = useCartStore();
  const subtotal = getCartSubtotal(items);
  const shipping = 0;

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-forest/25 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-pearl shadow-luxury"
          >
            <div className="flex items-center justify-between border-b border-forest/10 p-6">
              <h2 className="font-serif text-3xl">Your Cart</h2>
              <button aria-label="Close cart" onClick={closeCart}>
                <X />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <p className="font-serif text-3xl">Your selection is empty</p>
                    <p className="mt-2 text-sm text-moss">Discover soft silks and refined cuts.</p>
                    <Button href="/shop" className="mt-6" onClick={closeCart}>
                      Shop collection
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-5">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="grid grid-cols-[88px_1fr] gap-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-28 w-22 rounded-xl object-cover"
                      />
                      <div>
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="font-serif text-xl">{item.name}</p>
                            <p className="text-sm text-moss">Size {item.size}</p>
                          </div>
                          <button
                            aria-label="Remove item"
                            onClick={() => removeItem(item.productId, item.size)}
                            className="text-moss transition hover:text-rose"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-forest/10">
                            <button
                              aria-label="Decrease quantity"
                              className="p-2"
                              onClick={() => decrease(item.productId, item.size)}
                            >
                              <Minus size={15} />
                            </button>
                            <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              aria-label="Increase quantity"
                              className="p-2"
                              onClick={() => increase(item.productId, item.size)}
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                          <p className="font-semibold">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-forest/10 p-6">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Estimated total</span>
                  <span>{formatCurrency(subtotal + shipping)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                onClick={() => {
                  setCartCheckoutMode();
                  closeCart();
                }}
              >
                <Button className="mt-5 w-full" disabled={items.length === 0}>
                  Checkout
                </Button>
              </Link>
              <Link href="/cart" onClick={closeCart} className="mt-3 block text-center text-sm">
                View cart
              </Link>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
