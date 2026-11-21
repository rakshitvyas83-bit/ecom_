import type { Metadata } from "next";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";

export const metadata: Metadata = {
  title: "Kota Doria Ethnic Wear | Kota Karigari Official",
  description:
    "Shop Kota Karigari Official for elegant Indian ethnic wear, Kota Doria and doria-inspired styles, contemporary kurtas and festive fashion.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Kota Karigari Official | Kota Doria Ethnic Wear",
    description:
      "Explore contemporary ethnic wear, Kota Doria styles, kurtas and festive fashion from Kota Karigari.",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* <section className="luxury-container py-20">
        <SectionHeader eyebrow="Curated edits" title="Featured Categories" />
        <div className="grid gap-5 md:grid-cols-4">
          {categories.map((category) => (
            <a
              href={`/shop?category=${encodeURIComponent(category.name)}`}
              key={category.id}
              className="group relative min-h-[320px] overflow-hidden rounded-2xl shadow-silk"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/72 via-forest/12 to-transparent" />
              <div className="absolute bottom-0 p-6 text-pearl">
                <h3 className="font-serif text-3xl">{category.name}</h3>
                <p className="mt-2 text-sm text-pearl/78">{category.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section> */}
      <FeaturedProducts />
    </>
  );
}
