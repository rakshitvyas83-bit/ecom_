import type { Product, ProductCategory, ProductSize } from "@/types/product";
import { getProductPrice } from "@/utils/format";

export type SortKey = "manual" | "newest" | "price-asc" | "price-desc" | "popular";

export interface ProductFilters {
  size?: ProductSize | "All";
  category?: ProductCategory | "All";
  availability?: "All" | "In stock" | "Out of stock";
  maxPrice?: number;
  sort?: SortKey;
}

export function compareProductsByDisplayOrder(a: Product, b: Product): number {
  if (typeof a.displayOrder === "number" && typeof b.displayOrder === "number") {
    return (
      a.displayOrder - b.displayOrder ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  if (typeof a.displayOrder === "number") return -1;
  if (typeof b.displayOrder === "number") return 1;
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const filtered = products.filter((product) => {
    const currentPrice = getProductPrice(product);
    const sizeMatch =
      !filters.size || filters.size === "All" || product.sizes.includes(filters.size);
    const categoryMatch =
      !filters.category ||
      filters.category === "All" ||
      product.category === filters.category;
    const availabilityMatch =
      !filters.availability ||
      filters.availability === "All" ||
      (filters.availability === "In stock" ? product.stock > 0 : product.stock === 0);
    const priceMatch = !filters.maxPrice || currentPrice <= filters.maxPrice;

    return sizeMatch && categoryMatch && availabilityMatch && priceMatch;
  });

  return [...filtered].sort((a, b) => {
    if (filters.sort === "manual") {
      return compareProductsByDisplayOrder(a, b);
    }
    if (filters.sort === "price-asc") {
      return getProductPrice(a) - getProductPrice(b);
    }
    if (filters.sort === "price-desc") {
      return getProductPrice(b) - getProductPrice(a);
    }
    if (filters.sort === "popular") {
      return Number(b.popular) - Number(a.popular);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

// TODO: Replace mock catalog reads with Supabase queries from a product repository layer.
// TODO: After successful checkout, reduce stock per product and later per size in Supabase.
