import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Kota Karigari customer support for order, product and delivery assistance. Find our email, phone number and support hours.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="luxury-container py-12 sm:py-16">
      <article className="mx-auto max-w-3xl rounded-3xl border border-forest/10 bg-pearl/80 p-6 shadow-sm sm:p-10 lg:p-14">
        <header className="border-b border-forest/10 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
            We’re here to help
          </p>
          <h1 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-6 text-base leading-8 text-moss sm:text-lg">
            Have a question about Kota Karigari, a product, or an order? We’d love to
            hear from you. Reach out using the details below and our team will be happy
            to assist.
          </p>
        </header>

        <section className="mt-8 space-y-6">
          <div>
            <h2 className="font-serif text-xl text-forest">Email</h2>
            <a
              href="mailto:care@kotakarigari.com"
              className="mt-2 inline-block text-moss underline underline-offset-4 transition hover:text-forest"
            >
              care@kotakarigari.com
            </a>
          </div>
          <div>
            <h2 className="font-serif text-xl text-forest">Phone</h2>
            <a
              href="tel:+917303246953"
              className="mt-2 inline-block text-moss underline underline-offset-4 transition hover:text-forest"
            >
              7303246953
            </a>
          </div>
          <div>
            <h2 className="font-serif text-xl text-forest">Customer Support Hours</h2>
            <p className="mt-2 text-moss">10:00 AM – 6:00 PM</p>
          </div>
        </section>

        <p className="mt-9 border-t border-forest/10 pt-6 font-serif text-lg text-forest">
          Kota Karigari — Crafted by hands, chosen by hearts.
        </p>
      </article>
    </main>
  );
}
