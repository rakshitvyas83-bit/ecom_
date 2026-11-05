"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  aspect?: string;
  rotationDelay?: number;
}

export function ImageCarousel({
  images,
  alt,
  aspect = "aspect-[4/5]",
  rotationDelay = 0
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(index);
  const moveRef = useRef<(direction: number) => void>(() => {});

  const move = (direction: number) => {
    const nextIndex = (indexRef.current + direction + images.length) % images.length;
    setPrev(indexRef.current);
    setTransitioning(false);
    indexRef.current = nextIndex;
    setIndex(nextIndex);
  };
  moveRef.current = move;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsNearViewport(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // Stagger the first rotation and only run carousels near the viewport.
  useEffect(() => {
    if (images.length <= 1 || !isNearViewport) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      moveRef.current(1);
      interval = setInterval(() => moveRef.current(1), 6000);
    }, rotationDelay + 4000);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [images.length, isNearViewport, rotationDelay]);

  // Keep the previous image visible until the next image has loaded and faded in.
  useEffect(() => {
    if (prev === null || !transitioning) return;
    const t = setTimeout(() => {
      setPrev(null);
      setTransitioning(false);
    }, 750);
    return () => clearTimeout(t);
  }, [prev, transitioning]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 50) move(distance > 0 ? 1 : -1);
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden rounded-2xl bg-champagne/30 ${aspect}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Previous image fades out */}
      {prev !== null && (
        <img
          key={`prev-${prev}`}
          src={images[prev]}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
            transitioning ? "opacity-0" : "opacity-100"
          }`}
        />
      )}

      {/* Current image fades in */}
      <img
        key={`curr-${index}`}
        src={images[index]}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => {
          if (prev !== null) setTransitioning(true);
        }}
        className={`h-full w-full object-cover transition-opacity duration-700 ease-in-out group-hover:scale-105 ${
          prev === null || transitioning ? "opacity-100" : "opacity-0"
        }`}
      />

      {images.length > 1 ? (
        <>
          <button
            aria-label="Previous image"
            onClick={(e) => { e.preventDefault(); move(-1); }}
            className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-pearl/80 opacity-0 shadow-sm transition group-hover:opacity-100"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            aria-label="Next image"
            onClick={(e) => { e.preventDefault(); move(1); }}
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-pearl/80 opacity-0 shadow-sm transition group-hover:opacity-100"
          >
            <ChevronRight size={17} />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-pearl" : "w-1.5 bg-pearl/55"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}