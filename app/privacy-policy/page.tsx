import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Kota Karigari collects, uses, shares and protects information when you browse or place an order on our website.",
  alternates: { canonical: "/privacy-policy" },
};

const sections = [
  {
    title: "1. Information We Collect",
    intro: "We collect only the information necessary to process and fulfil customer orders. This may include:",
    points: [
      ["Name", "To identify the customer and process orders."],
      ["Delivery Address", "To deliver purchased products."],
      ["Email Address", "To send order confirmations and important order-related updates."],
      ["Phone Number", "To contact customers regarding their orders and delivery."],
    ],
    closing:
      "We do not intentionally collect any additional personal information beyond what is necessary for these purposes.",
  },
  {
    title: "2. How We Use Your Information",
    intro: "The information collected from customers is used solely for the following purposes:",
    points: [
      ["", "Processing and confirming customer orders."],
      ["", "Delivering products to the provided address."],
      ["", "Communicating order updates and delivery information."],
      ["", "Contacting customers regarding issues or queries related to their purchases."],
      ["", "Providing customer support."],
    ],
  },
  {
    title: "3. Sharing of Information",
    paragraphs: [
      "We do not sell, rent, or trade customers' personal information to third parties.",
      "We may share the necessary customer information with trusted service providers, such as delivery and logistics partners, payment service providers, and other parties involved in completing your order.",
      "Such information is shared only to the extent necessary to provide the requested services or comply with applicable legal obligations.",
    ],
  },
  {
    title: "4. Data Security",
    paragraphs: [
      "We take reasonable measures to protect customers' personal information against unauthorized access, alteration, disclosure, or destruction.",
      "While we strive to safeguard your information, no method of electronic storage or internet transmission is completely secure.",
    ],
  },
  {
    title: "5. Data Retention",
    paragraphs: [
      "We retain customer information only for as long as necessary to fulfil orders, provide customer support, maintain business records, and comply with applicable legal requirements.",
    ],
  },
  {
    title: "6. Cookies and Website Usage",
    paragraphs: [
      "Our website may use essential cookies or similar technologies required for its basic functionality and proper operation.",
      "We do not intentionally use cookies to collect sensitive personal information.",
    ],
  },
  {
    title: "7. Your Privacy Rights",
    intro: "You may contact us to:",
    points: [
      ["", "Request access to your personal information."],
      ["", "Request correction of inaccurate information."],
      ["", "Request deletion of your personal information, subject to applicable legal and record-retention requirements."],
      ["", "Raise concerns regarding how your information is being used."],
    ],
  },
  {
    title: "8. Third-Party Services",
    paragraphs: [
      "Our website may use third-party services for payment processing, shipping, and order fulfilment. These services may process relevant customer information in accordance with their own privacy policies.",
      "We encourage customers to review the privacy policies of these third-party providers where applicable.",
    ],
  },
  {
    title: "9. Changes to This Privacy Policy",
    paragraphs: [
      "We reserve the right to update or modify this Privacy Policy at any time. Any changes will be published on this page along with the updated effective date.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="luxury-container py-12 sm:py-16">
      <article className="mx-auto max-w-4xl rounded-3xl border border-forest/10 bg-pearl/80 p-6 shadow-sm sm:p-10 lg:p-14">
        <header className="mb-10 border-b border-forest/10 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
            Kota Karigari
          </p>
          <h1 className="mt-3 font-serif text-4xl text-forest sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-moss">
            <strong>Effective Date:</strong> 21 November 2026
          </p>
          <p className="mt-6 leading-7 text-moss">
            At Kota Karigari, we respect your privacy and are committed to protecting your
            personal information. This Privacy Policy explains what information we
            collect, how we use it, and how we protect it when you visit or make a
            purchase through our website.
          </p>
        </header>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-serif text-2xl text-forest">{section.title}</h2>
              {section.intro && (
                <p className="mt-3 leading-7 text-moss">{section.intro}</p>
              )}
              {section.points && (
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-moss marker:text-gold">
                  {section.points.map(([label, detail], index) => (
                    <li key={`${label}-${index}`}>
                      {label && <strong>{label}: </strong>}
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
              {section.paragraphs && (
                <div className="mt-3 space-y-3 leading-7 text-moss">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              )}
              {section.closing && (
                <p className="mt-3 leading-7 text-moss">{section.closing}</p>
              )}
            </section>
          ))}

          <section>
            <h2 className="font-serif text-2xl text-forest">10. Contact Us</h2>
            <p className="mt-3 leading-7 text-moss">
              If you have any questions, concerns, or requests regarding this Privacy
              Policy or your personal information, please contact us:
            </p>
            <div className="mt-3 space-y-2 leading-7 text-moss">
              <p><strong>Business / Website Name:</strong> Kota Karigari</p>
              <p>
                <strong>Email:</strong>{" "}
                <a className="underline underline-offset-4" href="mailto:care@kotakarigari.com">
                  care@kotakarigari.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a className="underline underline-offset-4" href="tel:+917303246953">
                  7303246953
                </a>
              </p>
            </div>
          </section>
        </div>

        <p className="mt-10 border-t border-forest/10 pt-6 leading-7 text-moss">
          By using our website and placing an order, you acknowledge that you have read
          this Privacy Policy.
        </p>
      </article>
    </main>
  );
}
