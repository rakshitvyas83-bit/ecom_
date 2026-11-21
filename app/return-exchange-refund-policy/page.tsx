import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return, Exchange & Refund Policy",
  description:
    "Review Kota Karigari's return, exchange and refund terms, including how to request assistance for an order.",
  alternates: { canonical: "/return-exchange-refund-policy" },
};

const sections = [
  {
    title: "1. Return & Exchange Requests",
    points: [
      "All return and exchange requests must be initiated through our official WhatsApp Customer Care number within 48 hours of receiving the order.",
      "Customers are required to share their order details, along with clear photographs or videos of the product, to help us assess the request.",
      "Return or exchange requests will be considered only after review and confirmation by our customer care team.",
      "Products must be returned in their original condition, unused, unwashed, unaltered and with original tags and packaging, wherever applicable.",
    ],
  },
  {
    title: "2. Product Verification",
    points: [
      "All returned products will undergo a quality and product verification check upon receipt.",
      "The returned item must be the same product originally dispatched by Kota Karigari, with no signs of use, damage, alteration or tampering.",
      "Any product found used, damaged after delivery, altered or different from the original product dispatched may be rejected for return or exchange.",
      "Refunds or exchanges will be processed only after successful verification and approval by our team.",
    ],
  },
  {
    title: "3. Refunds",
    points: [
      "Refunds, wherever approved, will be initiated only after the returned product has been received and successfully verified by Kota Karigari.",
      "Approved refunds will be processed through the original payment method or another mutually agreed mode.",
      "The processing time may vary depending on the payment provider or banking institution.",
      "Shipping charges, wherever applicable, may be non-refundable, except where the return is due to an incorrect, defective or damaged product attributable to Kota Karigari.",
    ],
  },
  {
    title: "4. Damaged, Defective or Incorrect Products",
    points: [
      "If you receive a damaged, defective or incorrect product, please notify us through WhatsApp Customer Care within 48 hours of delivery, along with supporting photographs or an unboxing video, wherever available.",
      "After verification, Kota Karigari will arrange an appropriate resolution, which may include a replacement, exchange or refund, as applicable.",
      "Customers are advised to retain the original packaging until the concern is resolved.",
    ],
  },
  {
    title: "5. Return Shipping & Responsibility",
    points: [
      "For approved returns due to customer preference, the cost of return shipping, wherever applicable, will be borne by the customer.",
      "In cases involving an incorrect, defective or damaged product attributable to Kota Karigari, the return shipping arrangement or cost will be handled by us.",
      "Customers are requested not to dispatch any product before receiving confirmation and return instructions from our customer care team.",
    ],
  },
  {
    title: "6. Important Note",
    points: [
      "Due to the handcrafted nature of our products, minor variations in colour, texture, weave and finish may occur. Such variations are inherent characteristics of handcrafted textiles and will not necessarily be considered defects.",
      "Any approved exchange will be subject to product availability.",
      "All return, exchange and refund requests will be evaluated in accordance with the above terms, with the objective of ensuring a fair and transparent resolution for both the customer and Kota Karigari.",
    ],
  },
];

export default function ReturnExchangeRefundPolicyPage() {
  return (
    <main className="luxury-container py-12 sm:py-16">
      <article className="mx-auto max-w-4xl rounded-3xl border border-forest/10 bg-pearl/80 p-6 shadow-sm sm:p-10 lg:p-14">
        <header className="mb-10 border-b border-forest/10 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
            Kota Karigari
          </p>
          <h1 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">
            Return, Exchange &amp; Refund Policy
          </h1>
          <p className="mt-6 leading-7 text-moss">
            At Kota Karigari, we strive to ensure that every purchase meets your
            expectations. In case you wish to request a return or exchange, please review
            the following terms:
          </p>
        </header>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-serif text-2xl text-forest">{section.title}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-moss marker:text-gold">
                {section.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-forest/10 bg-mist/60 p-5 sm:p-6">
          <h2 className="font-serif text-xl text-forest">Contact WhatsApp Customer Care</h2>
          <p className="mt-2 leading-7 text-moss">
            Start a return or exchange request within 48 hours by messaging us with your
            order details and product photos or video.
          </p>
          <a
            href="https://wa.me/917303246953"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-full bg-forest px-5 py-3 text-sm font-medium text-pearl transition hover:bg-[#421d29]"
          >
            WhatsApp us at 7303246953
          </a>
        </div>
      </article>
    </main>
  );
}
