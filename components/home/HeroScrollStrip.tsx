"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { listShowcasedProducts } from "@/lib/products";
import type { Product } from "@/types/product";

const CARD_W = 160;
const GAP = 14;
const SPEED = 0.55;

export function HeroScrollStrip() {
  const [products, setProducts] = useState<Product[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartPos = useRef(0);

  useEffect(() => {
    listShowcasedProducts().then(setProducts);
  }, []);

  const looped = [...products, ...products];
  const HALF = products.length * (CARD_W + GAP);

  useEffect(() => {
    if (products.length === 0) return;
    const track = trackRef.current;
    if (!track) return;

    const step = () => {
      if (!isDragging.current) {
        posRef.current += SPEED;
        if (posRef.current >= HALF) posRef.current -= HALF;
        track.style.transform = `translateX(${-posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [products.length, HALF]);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartPos.current = posRef.current;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const delta = dragStartX.current - e.clientX;
    posRef.current = dragStartPos.current + delta;
    if (posRef.current < 0) posRef.current += HALF;
    if (posRef.current >= HALF) posRef.current -= HALF;
    if (trackRef.current)
      trackRef.current.style.transform = `translateX(${-posRef.current}px)`;
  };
  const onMouseUp = () => { isDragging.current = false; };
  const onTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX;
    dragStartPos.current = posRef.current;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = dragStartX.current - e.touches[0].clientX;
    posRef.current = dragStartPos.current + delta;
    if (posRef.current < 0) posRef.current += HALF;
    if (posRef.current >= HALF) posRef.current -= HALF;
    if (trackRef.current)
      trackRef.current.style.transform = `translateX(${-posRef.current}px)`;
  };
  const onTouchEnd = () => { isDragging.current = false; };

  if (products.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="w-full overflow-hidden py-6 cursor-grab active:cursor-grabbing select-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ width: "max-content", gap: GAP }}
      >
        {looped.map((product, i) => (
          <Link
            key={`${product.id}-${i}`}
            href={`/products/${product.id}`}
            draggable={false}
            onClick={(e) => {
              if (Math.abs(posRef.current - dragStartPos.current) > 8)
                e.preventDefault();
            }}
            className="block shrink-0 overflow-hidden rounded-2xl shadow-silk"
            style={{ width: CARD_W, height: 210 }}
          >
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                draggable={false}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-champagne/40 flex items-center justify-center">
                <span className="text-xs text-moss/50">No photo</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}