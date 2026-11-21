import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Kota Karigari",
  description:
    "Meet Kota Karigari, an Indian ethnic wear label inspired by graceful fabrics, Kota Doria craftsmanship and contemporary silhouettes.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="luxury-container py-16">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
            About KOTA KARIGARI
          </p>
          <h1 className="mt-4 font-serif text-6xl leading-none">Enchanting. Elegant. Exquisite.</h1>
          <p className="mt-6 text-lg leading-8 text-moss">
            KOTA KARIGARI is a premium ethnic wear concept shaped around restrained beauty:
            off-white calm, blush softness, berry-toned confidence, and pieces that feel
            luxurious without feeling loud.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1594739033447-80ab21e24b67?auto=format&fit=crop&w=1300&q=85"
          alt="KOTA KARIGARI boutique fabric mood"
          className="min-h-[520px] rounded-[2rem] object-cover shadow-luxury"
        />
      </div>
    </div>
  );
}
