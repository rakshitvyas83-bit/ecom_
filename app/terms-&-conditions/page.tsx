import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Review the terms and conditions for shopping online with Kota Karigari Official.",
  alternates: { canonical: "/terms-&-conditions" },
};

const sections = [
  {
    title: "1. General Information",
    paragraphs: [
      "This website is owned and operated by Kota Karigari. Throughout the website, the terms “we”, “us” and “our” refer to Kota Karigari.",
      "By accessing our website or purchasing our products, you agree to comply with these Terms & Conditions and applicable laws of India.",
    ],
  },
  {
    title: "2. Products & Descriptions",
    points: [
      "We make every effort to display our products, colours, designs and descriptions as accurately as possible.",
      "As our products may feature traditional textiles and handcrafted elements, slight variations in colour, texture, weave, patterns or finish may occur.",
      "Such natural variations are part of the uniqueness and character of traditional craftsmanship and should not be considered defects.",
      "Actual product colours may vary slightly depending on your device’s screen settings and display resolution.",
      "Product availability is subject to change without prior notice.",
    ],
  },
  {
    title: "3. Pricing & Payments",
    points: [
      "All prices displayed on the website are in Indian Rupees (INR), unless otherwise specified.",
      "Applicable taxes and delivery charges will be displayed at checkout, wherever applicable.",
      "We reserve the right to revise product prices without prior notice. However, confirmed orders will be charged at the price applicable at the time of purchase.",
      "Payments must be completed through the payment options available on our website.",
      "An order will be processed only after successful payment confirmation, unless a different payment arrangement is explicitly offered.",
    ],
  },
  {
    title: "4. Order Confirmation & Cancellation",
    points: [
      "Once an order is placed, an order confirmation will be shared through the registered email address or mobile number.",
      "We reserve the right to cancel an order in cases of product unavailability, pricing errors, suspected fraudulent transactions or other operational reasons.",
      "Customers may request cancellation before the order is dispatched by contacting our customer support team.",
      "Once an order has been dispatched, cancellation may not be possible.",
    ],
  },
  {
    title: "5. Shipping & Delivery",
    points: [
      "We aim to dispatch orders within the estimated processing time mentioned on the website.",
      "Delivery timelines are indicative and may vary depending on the delivery location, courier partner and unforeseen circumstances.",
      "Kota Karigari shall not be held responsible for delays caused by courier partners, natural events or circumstances beyond our reasonable control.",
      "Customers are responsible for providing accurate shipping details at the time of placing an order.",
    ],
  },
  {
    title: "6. Returns, Exchanges & Refunds",
    points: [
      "Customers are requested to review our separate Return, Exchange and Refund Policy before making a purchase.",
      "Products must be returned in their original condition, unused, unwashed and with original tags and packaging, wherever applicable.",
      "Products showing signs of use, damage caused after delivery or alteration may not qualify for return or exchange.",
      "Any eligible refund will be processed through the original payment method or another mutually agreed mode.",
      "Shipping charges, where applicable, may be non-refundable.",
    ],
  },
  {
    title: "7. Product Care",
    paragraphs: [
      "Traditional textiles and handcrafted products may require special care. Customers are advised to opt for hand wash only.",
      "Kota Karigari shall not be responsible for damage resulting from improper washing, ironing, storage or handling.",
    ],
  },
  {
    title: "8. Intellectual Property",
    paragraphs: [
      "All content on this website, including photographs, product descriptions, designs, logos, graphics, text and branding, is the property of Kota Karigari or its respective content owners.",
      "No content may be copied, reproduced, distributed or commercially used without prior written permission.",
    ],
  },
  {
    title: "9. User Responsibilities",
    intro: "By using this website, you agree:",
    points: [
      "To provide accurate and complete information while placing orders.",
      "Not to use the website for unlawful or fraudulent activities.",
      "Not to attempt unauthorised access to the website or its systems.",
      "Not to reproduce or misuse website content or intellectual property.",
    ],
  },
  {
    title: "10. Limitation of Liability",
    paragraphs: [
      "Kota Karigari shall not be liable for indirect, incidental or consequential losses arising from the use of this website or purchase of products, to the extent permitted under applicable law.",
      "Nothing in these Terms & Conditions shall limit any consumer rights that cannot legally be excluded under Indian law.",
    ],
  },
  {
    title: "11. Privacy & Security",
    paragraphs: [
      "We respect your privacy and are committed to protecting your personal information. Information collected during browsing, registration or purchases will be handled in accordance with our Privacy Policy and applicable data protection laws.",
    ],
  },
  {
    title: "12. Changes to Terms & Conditions",
    paragraphs: [
      "Kota Karigari reserves the right to update or modify these Terms & Conditions from time to time. Any changes will be published on this page and will become effective upon publication.",
    ],
  },
  {
    title: "13. Governing Law & Jurisdiction",
    paragraphs: [
      "These Terms & Conditions shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts in the applicable jurisdiction, subject to applicable consumer protection laws.",
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

export default function TermsAndConditionsPage() {
  return (
    <main className="luxury-container py-12 sm:py-16">
      <article className="mx-auto max-w-4xl rounded-3xl border border-forest/10 bg-pearl/80 p-6 shadow-sm sm:p-10 lg:p-14">
        <header className="mb-10 border-b border-forest/10 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
            Kota Karigari
          </p>
          <h1 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">
            Terms & Conditions
          </h1>
          <p className="mt-6 leading-7 text-moss">Welcome to Kota Karigari!</p>
          <p className="mt-3 leading-7 text-moss">
            Thank you for visiting Kota Karigari. We are committed to celebrating the rich
            heritage of Kota’s craftsmanship and bringing the beauty of traditional Indian
            textiles and artistry to your wardrobe and lifestyle.
          </p>
          <p className="mt-3 leading-7 text-moss">
            By accessing or purchasing from our website, you agree to the following Terms
            & Conditions. Please read them carefully before placing an order.
          </p>
        </header>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-serif text-2xl text-forest">{section.title}</h2>
              {section.intro && <p className="mt-3 leading-7 text-moss">{section.intro}</p>}
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
            <h2 className="font-serif text-2xl text-forest">14. Contact Us</h2>
            <p className="mt-3 leading-7 text-moss">
              For questions, concerns or assistance regarding these Terms & Conditions,
              please contact:
            </p>
            <ContactDetails />
          </section>
        </div>

        <p className="mt-10 border-t border-forest/10 pt-6 leading-7 text-forest">
          Thank you for being a part of our journey in celebrating India’s rich textile
          heritage.
        </p>
      </article>
    </main>
  );
}
