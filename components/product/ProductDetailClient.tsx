"use client";

import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { createCartItem, saveBuyNowItem, useCartStore } from "@/store/cart-store";
import type { Product, ProductSize } from "@/types/product";
import { formatCurrency, getProductPrice } from "@/utils/format";

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
}

export function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [fading, setFading] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [size, setSize] = useState<ProductSize>(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const setBuyNowItem = useCartStore((state) => state.setBuyNowItem);
  const currentPrice = getProductPrice(product);
  const sizeStock =
    product.sizeInventory.find((item) => item.size === size)?.stock ?? product.stock;
  const unavailable = product.stock <= 0 || sizeStock <= 0;

  const addToCart = () => addItem(product, size, quantity);
  const buyNow = () => {
    const item = createCartItem(product, size, quantity);

    if (!item) {
      alert("Cannot proceed: Product out of stock for selected size");
      return;
    }

    // Save to storage (both sessionStorage and localStorage)
    saveBuyNowItem(item);
    // Update Zustand store
    setBuyNowItem(product, size, quantity);
    
    // Use a small setTimeout to ensure state is fully persisted before navigation
    setTimeout(() => {
      router.push("/checkout?mode=buy-now");
    }, 100);
  };

  const switchImage = (i: number) => {
    if (i === index) return;
    setPrevIndex(index);
    setFading(true);
    setIndex(i);
    setTimeout(() => {
      setPrevIndex(null);
      setFading(false);
    }, 600);
  };

  return (
    <div className="luxury-container py-12">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-4 md:grid-cols-[96px_1fr]">

          {/* Thumbnails */}
          <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex md:flex-col md:overflow-visible">
            {product.images.map((item, i) => (
              <button
                key={item}
                onClick={() => switchImage(i)}
                className={`h-24 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                  i === index ? "border-gold scale-105" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={item} alt={product.name} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div
            className="group order-1 relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-champagne/30 shadow-luxury md:order-2"
            onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const delta = touchStart - e.changedTouches[0].clientX;
              if (Math.abs(delta) > 50)
                switchImage(
                  delta > 0
                    ? (index + 1) % product.images.length
                    : (index - 1 + product.images.length) % product.images.length
                );
            }}
          >
            {prevIndex !== null && (
              <img
                key={`prev-${prevIndex}`}
                src={product.images[prevIndex]}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500"
              />
            )}
            <img
              key={`curr-${index}`}
              src={product.images[index]}
              alt={product.name}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:scale-105 transition-transform duration-700 ${
                fading ? "opacity-0" : "opacity-100"
              }`}
            />

            {product.images.length > 1 && (
              <>
                <button
                  aria-label="Previous image"
                  onClick={() => switchImage((index - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-pearl/80 shadow-sm opacity-0 transition group-hover:opacity-100"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  aria-label="Next image"
                  onClick={() => switchImage((index + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-pearl/80 shadow-sm opacity-0 transition group-hover:opacity-100"
                >
                  <ChevronRight size={18} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === index ? "w-6 bg-pearl" : "w-1.5 bg-pearl/55"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
        <section className="rounded-[2rem] bg-pearl/70 p-6 shadow-sm md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {product.category}
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-forest">{product.name}</h1>
          <div className="mt-5 flex items-center gap-3">
            <span className="text-2xl font-semibold">{formatCurrency(currentPrice)}</span>
            {/* Discount display can be restored by re-enabling getProductPrice in utils/format.ts.
            {product.discountPrice ? (
              <span className="text-moss/60 line-through">{formatCurrency(product.price)}</span>
            ) : null} */}
          </div>
          <p className="mt-6 leading-8 text-moss">{product.description}</p>
          <div className="mt-6 rounded-2xl bg-mist/70 p-5 text-sm leading-7 text-moss">
            <p><span className="font-semibold text-forest">Delivery:</span> Estimated shipping in 3-5 business days.</p>
            <p><span className="font-semibold text-forest">Stock:</span> {unavailable ? "Out of stock" : `${sizeStock} available in ${size}`}</p>
          </div>
          <div className="mt-7">
            <p className="mb-3 text-sm font-semibold">Select size</p>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((item) => (
                <button
                  key={item}
                  onClick={() => setSize(item)}
                  className={`h-12 min-w-16 rounded-full border px-5 font-semibold transition ${
                    item === size
                      ? "border-forest bg-forest text-pearl"
                      : "border-forest/12 bg-pearl text-forest hover:border-gold"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-7 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-forest/10 bg-pearl">
              <button className="p-3" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus size={16} />
              </button>
              <span className="min-w-10 text-center">{quantity}</span>
              <button
                className="p-3"
                onClick={() => setQuantity(Math.min(sizeStock || 1, quantity + 1))}
              >
                <Plus size={16} />
              </button>
            </div>
            <span className="text-sm text-moss">Quantity</span>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button disabled={unavailable} onClick={addToCart}>
              <ShoppingBag size={17} /> Add to cart
            </Button>
            <Button
              disabled={unavailable}
              variant="secondary"
              onClick={buyNow}
            >
              <Zap size={17} /> Buy now
            </Button>
          </div>
        </section>
      </div>
      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="mb-8 font-serif text-4xl">Related pieces</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
