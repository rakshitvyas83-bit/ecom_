"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getCartSubtotal, useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/utils/format";

export function CartPageClient() {
  const { items, increase, decrease, removeItem, setCartCheckoutMode } = useCartStore();
  const subtotal = getCartSubtotal(items);
  const shipping = 0;

  return (
    <div className="luxury-container py-14">
      <h1 className="font-serif text-5xl">Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="mt-10 rounded-[2rem] bg-pearl/72 p-10 text-center shadow-sm">
          <p className="font-serif text-3xl">Your cart is empty</p>
          <Button href="/shop" className="mt-6">Shop collection</Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-5">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="grid gap-4 rounded-2xl bg-pearl/75 p-4 shadow-sm sm:grid-cols-[120px_1fr_auto]">
                <img src={item.image} alt={item.name} className="h-36 w-full rounded-xl object-cover sm:w-30" />
                <div>
                  <h2 className="font-serif text-3xl">{item.name}</h2>
                  <p className="mt-1 text-sm text-moss">Size {item.size}</p>
                  <p className="mt-3 font-semibold">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:justify-between">
                  <button onClick={() => removeItem(item.productId, item.size)} className="text-moss hover:text-rose"><Trash2 size={18} /></button>
                  <div className="flex items-center rounded-full border border-forest/10">
                    <button className="p-2" onClick={() => decrease(item.productId, item.size)}><Minus size={15} /></button>
                    <span className="min-w-8 text-center">{item.quantity}</span>
                    <button className="p-2" onClick={() => increase(item.productId, item.size)}><Plus size={15} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-[2rem] bg-forest p-7 text-pearl shadow-luxury">
            <h2 className="font-serif text-3xl">Order Summary</h2>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(shipping)}</span></div>
              <div className="flex justify-between border-t border-pearl/15 pt-4 text-base font-semibold"><span>Total</span><span>{formatCurrency(subtotal + shipping)}</span></div>
            </div>
            <Button
              href="/checkout"
              onClick={setCartCheckoutMode}
              className="mt-7 w-full bg-pearl text-forest hover:bg-champagne"
            >
              Checkout
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}
