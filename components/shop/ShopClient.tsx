"use client";

import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { filterProducts, type SortKey } from "@/lib/catalog";
import { listProducts } from "@/lib/products";
import type { Product, ProductCategory, ProductSize } from "@/types/product";

const sizes: Array<ProductSize | "All"> = ["All", "XS", "S", "M", "L", "XL", "XXL"];
const categories: Array<ProductCategory | "All"> = [
  "All",
  "Work Wear",
  "Festive Wear",
  "Daily Wear",
  "Premium Collection"
];

export function ShopClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [size, setSize] = useState<ProductSize | "All">("All");
  const [category, setCategory] = useState<ProductCategory | "All">("All");
  const [availability, setAvailability] = useState<"All" | "In stock" | "Out of stock">("All");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => {
    listProducts().then(setProducts).catch((error) => {
      console.error("Failed to load shop products", error);
    });
  }, []);

  const visibleProducts = useMemo(
    () => filterProducts(products, { size, category, availability, maxPrice, sort }),
    [products, size, category, availability, maxPrice, sort]
  );

  return (
    <div className="luxury-container py-14">
      <SectionHeader
        eyebrow="Shop"
        title="The KOTA KARIGARI Collection"
        copy="Filter silk-like kurtis, festive edits, and refined daily wear by size, category, and availability."
      />
      <div className="mb-10 rounded-2xl border border-forest/10 bg-pearl/72 p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal size={18} /> Filters
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          <label className="grid gap-2 text-sm">
            Size
            <select value={size} onChange={(e) => setSize(e.target.value as ProductSize | "All")} className="rounded-full border border-forest/10 bg-pearl/92 px-4 py-3">
              {sizes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value as ProductCategory | "All")} className="rounded-full border border-forest/10 bg-pearl/92 px-4 py-3">
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Availability
            <select value={availability} onChange={(e) => setAvailability(e.target.value as "All" | "In stock" | "Out of stock")} className="rounded-full border border-forest/10 bg-pearl/92 px-4 py-3">
              {["All", "In stock", "Out of stock"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Price up to {maxPrice}
            <input type="range" min="2500" max="10000" step="500" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
          </label>
          <label className="grid gap-2 text-sm">
            Sort
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded-full border border-forest/10 bg-pearl/92 px-4 py-3">
              <option value="newest">Newest</option>
              <option value="price-asc">Price Low to High</option>
              <option value="price-desc">Price High to Low</option>
              <option value="popular">Popular</option>
            </select>
          </label>
        </div>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            imageRotationDelay={(index % 4) * 1200}
          />
        ))}
      </div>
    </div>
  );
}
