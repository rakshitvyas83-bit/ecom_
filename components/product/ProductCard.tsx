"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, Heart, Minus, Plus, ShoppingBag, X, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createCartItem, saveBuyNowItem, useCartStore } from "@/store/cart-store";
import type { Product, ProductSize } from "@/types/product";
import { formatCurrency } from "@/utils/format";
import { ImageCarousel } from "./ImageCarousel";
import { useWishlistStore } from "@/store/wishlist-store";

interface ProductCardProps {
  product: Product;
  imageRotationDelay?: number;
}

function ProductPreviewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const setBuyNowItem = useCartStore((state) => state.setBuyNowItem);
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [fading, setFading] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [size, setSize] = useState<ProductSize>(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const currentPrice = product.discountPrice ?? product.price;
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const sizeStock =
    product.sizeInventory.find((item) => item.size === size)?.stock ?? product.stock;
  const unavailable = product.stock <= 0 || sizeStock <= 0;

  const switchImage = (i: number) => {
    if (i === index) return;
    setPrevIndex(index);
    setFading(true);
    setIndex(i);
    setTimeout(() => { setPrevIndex(null); setFading(false); }, 600);
  };

  const addToCart = () => {
    addItem(product, size, quantity);
    onClose();
  };

  const buyNow = () => {
    const item = createCartItem(product, size, quantity);

    if (!item) return;

    saveBuyNowItem(item);
    setBuyNowItem(product, size, quantity);
    onClose();
    router.push("/checkout?mode=buy-now");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] bg-pearl shadow-luxury"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-pearl/90 shadow-sm transition hover:text-rose"
        >
          <X size={18} />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Images */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[2rem] md:rounded-l-[2rem] md:rounded-tr-none bg-champagne/30"
            onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const delta = touchStart - e.changedTouches[0].clientX;
              if (Math.abs(delta) > 50)
                switchImage(delta > 0
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
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => switchImage((index - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-pearl/80 shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => switchImage((index + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-pearl/80 shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-5 bg-pearl" : "w-1.5 bg-pearl/55"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between p-6 md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{product.category}</p>
              <h2 className="mt-2 font-serif text-3xl leading-tight text-forest">{product.name}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-xl font-semibold text-forest">{formatCurrency(currentPrice)}</span>
                {product.discountPrice && (
                  <span className="text-moss/60 line-through">{formatCurrency(product.price)}</span>
                )}
                {discount > 0 && (
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold">
                    {discount}% off
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-7 text-moss line-clamp-3">{product.description}</p>

              {/* Size selector */}
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-forest">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((item) => (
                    <button
                      key={item}
                      onClick={() => setSize(item)}
                      className={`h-10 min-w-12 rounded-full border px-4 text-sm font-semibold transition ${
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

              {/* Stock */}
              <p className={`mt-3 text-xs font-semibold ${unavailable ? "text-rose" : "text-moss"}`}>
                {unavailable ? "Out of stock" : `${sizeStock} available in ${size}`}
              </p>

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center rounded-full border border-forest/10 bg-pearl">
                  <button className="p-2.5" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus size={14} />
                  </button>
                  <span className="min-w-8 text-center text-sm">{quantity}</span>
                  <button className="p-2.5" onClick={() => setQuantity(Math.min(sizeStock || 1, quantity + 1))}>
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-xs text-moss">Quantity</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 grid gap-2">
              <Button disabled={unavailable} onClick={addToCart}>
                <ShoppingBag size={16} /> Add to cart
              </Button>
              <Button
                disabled={unavailable}
                variant="secondary"
                onClick={buyNow}
              >
                <Zap size={16} /> Buy now
              </Button>
              <Link
                href={`/products/${product.id}`}
                className="mt-1 text-center text-xs text-moss underline-offset-2 hover:underline"
              >
                View full page →
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProductCard({ product, imageRotationDelay = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const toggleItem = useWishlistStore(
    (state) => state.toggleItem
  );

  const isWishlisted = useWishlistStore((state) =>
    state.items.some((item) => item.id === product.id)
  );

  const [showPreview, setShowPreview] = useState(false);

  const currentPrice = product.discountPrice ?? product.price;

  const discount = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) /
          product.price) *
          100
      )
    : 0;

  const isOut = product.stock <= 0;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55 }}
        className="group flex h-full flex-col"
      >
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative">
            <ImageCarousel
              images={product.images}
              alt={product.name}
              rotationDelay={imageRotationDelay}
            />
            <button
              aria-label="Quick preview"
              onClick={(e) => { e.preventDefault(); setShowPreview(true); }}
              className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-pearl/88 shadow-sm transition hover:text-gold"
            >
              <Eye size={18} />
            </button>
            <button
  aria-label="Add to wishlist"
  onClick={(e) => {
    e.preventDefault();
    toggleItem(product);
  }}
  className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full shadow-sm transition ${
    isWishlisted
      ? "bg-rose text-white"
      : "bg-pearl/88 hover:text-rose"
  }`}
>
  <Heart
    size={18}
    fill={isWishlisted ? "currentColor" : "none"}
  />
</button>
          </div>
        </Link>
        <div className="flex flex-1 flex-col justify-between pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <Link href={`/products/${product.id}`}>
                <h3 className="line-clamp-2 font-serif text-2xl text-forest transition group-hover:text-gold">
                  {product.name}
                </h3>
              </Link>
              <p className="mt-1 text-sm text-moss">{product.category}</p>
            </div>
            <span className={`mt-1 whitespace-nowrap text-xs font-semibold ${isOut ? "text-rose" : "text-moss"}`}>
              {isOut ? "Out of stock" : `${product.stock} left`}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-forest">{formatCurrency(currentPrice)}</span>
            {product.discountPrice && (
              <span className="text-moss/60 line-through">{formatCurrency(product.price)}</span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold">
                {discount}% off
              </span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-moss">
            {product.sizes.map((size) => (
              <span key={size} className="rounded-full border border-forest/10 px-2 py-1">
                {size}
              </span>
            ))}
          </div>
          <Button
  className="mt-4 w-full"
  disabled={isOut}
  onClick={() => setShowPreview(true)}
>
  <ShoppingBag size={16} /> Quick Add
</Button>
        </div>
      </motion.article>

      <AnimatePresence>
        {showPreview && (
          <ProductPreviewModal product={product} onClose={() => setShowPreview(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
