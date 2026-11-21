import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description:
    "Read Kota Karigari's shipping and delivery information, including order processing, delivery timelines, tracking and customer support.",
  alternates: { canonical: "/shipping-policy" },
};

const sections = [
  {
    title: "1. Order Processing",
    points: [
      "All orders are processed within 2–4 business days after successful payment confirmation.",
      "Orders are not processed on Sundays and public holidays.",
      "During festive seasons, promotional events or periods of high demand, processing may take additional time.",
      "Once your order is dispatched, you will receive a confirmation along with tracking details, wherever available.",
    ],
  },
  {
    title: "2. Shipping & Delivery Timelines",
    points: [
      "We currently offer shipping across India.",
      "Orders are generally delivered within 5–10 business days from the date of dispatch, depending on the delivery location.",
      "Delivery timelines are estimates and may vary due to courier operations, weather conditions, public holidays or other unforeseen circumstances.",
      "Remote locations may require additional delivery time.",
    ],
  },
  {
    title: "3. Shipping Charges",
    points: [
      "Shipping charges, if applicable, will be displayed at the time of checkout.",
      "Any applicable free-shipping offers will be communicated on the website or during promotional campaigns.",
      "Additional charges, if any, for special delivery services will be communicated to customers before order confirmation.",
    ],
  },
  {
    title: "4. Order Tracking",
    paragraphs: [
      "Once your order has been dispatched, tracking details will be shared through your registered email address or mobile number, wherever supported by our logistics partner.",
      "Customers can use these details to track the status of their shipment.",
    ],
  },
  {
    title: "5. Accurate Shipping Information",
    paragraphs: [
      "Customers are requested to ensure that their name, complete delivery address, PIN code and contact number are accurate while placing an order.",
      "Kota Karigari will not be responsible for delivery delays or failed deliveries resulting from incorrect or incomplete shipping information provided by the customer.",
      "If you notice an error in your shipping details, please contact us immediately. We will try our best to assist you before dispatch.",
    ],
  },
  {
    title: "6. Delayed or Undelivered Orders",
    paragraphs: [
      "While we make every effort to ensure timely delivery, certain circumstances beyond our control may cause delays.",
      "If your order has not been delivered within the estimated delivery period, please contact our customer support team with your order details.",
      "We will coordinate with our logistics partner to help resolve the issue.",
    ],
  },
  {
    title: "7. Damaged or Missing Packages",
    paragraphs: [
      "We request customers to inspect their packages upon delivery.",
      "If you receive a visibly damaged package, or find that an item is missing, please notify us within 48 hours of delivery, along with photographs or an unboxing video wherever possible.",
      "Our team will review the concern and assist in accordance with our Return, Exchange and Refund Policy and applicable consumer protection laws.",
    ],
  },
  {
    title: "8. International Shipping",
    paragraphs: [
      "At present, our shipping services are limited to India. International shipping may be introduced in the future and will be communicated through our website.",
    ],
  },
];

function ContactDetails() {
  return (
    <div className="mt-4 space-y-1 text-sm leading-7 text-moss">
      <p>Kota Karigari</p>
      <p>
        Email:{" "}
        <a className="text-forest underline underline-offset-4" href="mailto:care@kotakarigari.com">
          care@kotakarigari.com
        </a>
      </p>
      <p>
        Contact Number:{" "}
        <a className="text-forest underline underline-offset-4" href="tel:+917303246953">
          7303246953
        </a>
      </p>
      <p>Customer Support Hours: 10:00 AM – 6:00 PM</p>
    </div>
  );
}

export default function ShippingPolicyPage() {
  return (
    <main className="luxury-container py-12 sm:py-16">
      <article className="mx-auto max-w-4xl rounded-3xl border border-forest/10 bg-pearl/80 p-6 shadow-sm sm:p-10 lg:p-14">
        <header className="mb-10 border-b border-forest/10 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
            Kota Karigari
          </p>
          <h1 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">
            Shipping Policy
          </h1>
          <p className="mt-6 leading-7 text-moss">
            At Kota Karigari, we believe that every creation carries a story of heritage,
            craftsmanship and tradition. We take utmost care in packaging and delivering
            your orders so that the beauty of our products reaches you safely.
          </p>
          <p className="mt-3 leading-7 text-moss">
            Please read our Shipping & Delivery Policy to understand how we process and
            deliver your orders.
          </p>
        </header>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-serif text-2xl text-forest">{section.title}</h2>
              {section.paragraphs && (
                <div className="mt-3 space-y-3 leading-7 text-moss">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              )}
              {section.points && (
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-moss marker:text-gold">
                  {section.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              )}
            </section>
          ))}

          <section>
            <h2 className="font-serif text-2xl text-forest">9. Contact Us</h2>
            <p className="mt-3 leading-7 text-moss">
              For any shipping-related queries, order tracking assistance or delivery
              concerns, please contact us:
            </p>
            <ContactDetails />
          </section>
        </div>

        <p className="mt-10 border-t border-forest/10 pt-6 font-serif text-lg text-forest">
          Kota Karigari – Crafted by hands, Chosen by hearts.
        </p>
      </article>
    </main>
  );
}
