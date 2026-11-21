import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop Kota Doria & Women's Ethnic Wear",
  description:
    "Browse Kota Karigari kurtas, Kota Doria styles, festive outfits and everyday Indian ethnic wear. Explore the collection by size, category and price.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return <ShopClient />;
}
