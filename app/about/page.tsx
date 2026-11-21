import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Kota Karigari",
  description:
    "Meet Kota Karigari, an Indian ethnic wear label inspired by graceful fabrics, Kota Doria craftsmanship and contemporary silhouettes.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="luxury-container py-12 sm:py-16">
      <article className="mx-auto max-w-4xl rounded-3xl border border-forest/10 bg-pearl/80 p-6 shadow-sm sm:p-10 lg:p-14">
        <header className="mb-10 border-b border-forest/10 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
            Our Story
          </p>
          <h1 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">
            About Kota Karigari
          </h1>
          <div className="mt-6 space-y-4 text-base leading-8 text-moss sm:text-lg">
            <p>
              At Kota Karigari, we believe that true elegance lies in the beauty of
              tradition, the grace of simplicity, and the stories woven into every fabric.
            </p>
            <p>
              Rooted in the rich textile heritage of Kota, Rajasthan, our brand celebrates
              the timeless charm of Kota Doria—a fabric admired for its delicate weave,
              lightness, texture and distinctive character.
            </p>
            <p>
              We bring this heritage into the contemporary world through thoughtfully
              designed clothing that blends traditional inspiration with modern
              sensibilities. Our creations are designed for women who appreciate
              understated elegance, meaningful craftsmanship and the beauty of Indian
              textiles.
            </p>
          </div>
        </header>

        <div className="space-y-9 text-moss">
          <section>
            <h2 className="font-serif text-2xl text-forest sm:text-3xl">
              A Heritage That Lives On
            </h2>
            <div className="mt-3 space-y-4 leading-7">
              <p>
                Kota Doria is more than a fabric. It is a part of Rajasthan&apos;s cultural
                legacy—a textile tradition that reflects generations of knowledge,
                artistry and an enduring relationship with the craft of weaving.
              </p>
              <p>
                At Kota Karigari, we seek to honour this legacy while giving it a fresh
                expression. Through our collections, we celebrate the beauty of
                traditional textiles in styles that feel relevant, graceful and effortless
                today.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-forest sm:text-3xl">
              The Art of Everyday Elegance
            </h2>
            <div className="mt-3 space-y-4 leading-7">
              <p>We believe clothing should feel as beautiful as it looks.</p>
              <p>
                Our collections are thoughtfully curated for women who value comfort,
                elegance and individuality. From everyday moments to festive occasions
                and special celebrations, each piece is created to bring a touch of
                timeless Indian grace to your wardrobe.
              </p>
              <p>
                Inspired by the colours, textures and cultural richness of India, Kota
                Karigari brings together heritage and contemporary design in a way that
                feels both timeless and personal.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-forest sm:text-3xl">Our Philosophy</h2>
            <div className="mt-3 space-y-4 leading-7">
              <p>We believe heritage should not remain confined to the past.</p>
              <p>It should be celebrated, worn, experienced and carried forward.</p>
              <p>
                Through Kota Karigari, we aspire to make the beauty of traditional Indian
                textiles a part of modern lifestyles—preserving their spirit while
                embracing the possibilities of contemporary fashion.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-forest sm:text-3xl">Our Promise</h2>
            <div className="mt-3 space-y-4 leading-7">
              <p>
                Every collection reflects our commitment to thoughtful design, timeless
                aesthetics and the enduring beauty of Indian textile heritage.
              </p>
              <p>
                We invite you to discover the world of Kota Karigari—a world where
                tradition meets contemporary elegance, and every piece tells a story.
              </p>
            </div>
          </section>
        </div>

        <p className="mt-10 border-t border-forest/10 pt-7 text-center font-serif text-xl font-semibold text-forest sm:text-2xl">
          Kota Karigari — Crafted by Hands, Chosen by Hearts
        </p>
      </article>
    </main>
  );
}
