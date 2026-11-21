import type { Product } from "@/types/product";

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

export const getProductPrice = (product: Pick<Product, "price" | "discountPrice">) => {
  // Re-enable discounts by returning product.discountPrice ?? product.price.
  return product.price;
};
