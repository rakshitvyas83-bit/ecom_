import type { Metadata } from "next";
import { categories } from "@/data/products";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Ethnic Wear Collections",
  description:
    "Explore Kota Karigari collections for elegant everyday wear, festive styles and contemporary Indian ethnic fashion.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  return (
    <div className="luxury-container py-14">
      <SectionHeader eyebrow="Collections" title="Quiet Luxury, Ethnic Ease" />
      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((category) => (
          <a key={category.id} href={`/shop?category=${encodeURIComponent(category.name)}`} className="group relative min-h-[420px] overflow-hidden rounded-[2rem] shadow-luxury">
            <img src={category.image} alt={category.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/75 to-transparent" />
            <div className="absolute bottom-0 p-8 text-pearl">
              <h2 className="font-serif text-5xl">{category.name}</h2>
              <p className="mt-3 max-w-md text-pearl/78">{category.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
