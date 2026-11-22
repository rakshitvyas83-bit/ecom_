"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { listProducts } from "@/lib/products";
import type { Product } from "@/types/product";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    listProducts().then(setProducts).catch((error) => {
      console.error("Failed to load featured products", error);
    });
  }, []);

  const featured = products.filter((product) => product.featured).slice(0, 12);

  return (
    <section className="bg-mist/70 py-12">
      <div className="luxury-container">
        <SectionHeader
          
          title="Featured Products"
        />
        <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
          {featured.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              imageRotationDelay={(index % 4) * 1200}
              showCardActions={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
