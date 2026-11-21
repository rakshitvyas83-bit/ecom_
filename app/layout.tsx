import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { CartNotice } from "@/components/cart/CartNotice";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { AuthProvider } from "@/context/AuthContext";
import { AccountSync } from "@/components/providers/AccountSync";


export const metadata: Metadata = {
  metadataBase: new URL("https://www.kotakarigari.com"),
  title: {
    default: "Kota Doria & Ethnic Wear | Kota Karigari Official",
    template: "%s | Kota Karigari Official",
  },
  description:
    "Discover Kota Karigari Official for contemporary Indian ethnic wear, Kota Doria styles, kurtas and festive fashion. Shop elegant everyday and occasion wear online.",
  applicationName: "Kota Karigari",
  keywords: [
    "Kota Karigari",
    "Kotakarigari",
    "Kota Karigari Official",
    "Kota Doria",
    "Kota Doriya",
    "Doria",
    "Indian ethnic wear",
    "women's kurtas",
    "festive wear",
    "Indo-western fashion",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Kota Karigari Official",
    title: "Kota Karigari Official | Kota Doria & Ethnic Wear",
    description:
      "Shop contemporary Indian ethnic wear, Kota Doria styles, kurtas and festive fashion from Kota Karigari.",
    url: "https://www.kotakarigari.com/",
    images: [{ url: "/banners/desktop/banner1.png", alt: "Kota Karigari collection" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kota Karigari Official | Kota Doria & Ethnic Wear",
    description:
      "Shop contemporary Indian ethnic wear, Kota Doria styles, kurtas and festive fashion.",
    images: ["/banners/desktop/banner1.png"],
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
            <body>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify([
                    {
                      "@context": "https://schema.org",
                      "@type": "Organization",
                      name: "Kota Karigari",
                      alternateName: ["Kotakarigari", "Kota Karigari Official"],
                      url: "https://www.kotakarigari.com/",
                      logo: "https://www.kotakarigari.com/pics/logo.png",
                      email: "care@kotakarigari.com",
                      telephone: "+91-7303246953",
                      sameAs: [
                        "https://www.instagram.com/kotakarigari.official?dmpr=bXVlZGRhMHlrcjFj",
                      ],
                    },
                    {
                      "@context": "https://schema.org",
                      "@type": "WebSite",
                      name: "Kota Karigari Official",
                      alternateName: "Kotakarigari",
                      url: "https://www.kotakarigari.com/",
                      inLanguage: "en-IN",
                    },
                  ]),
                }}
              />
              <AuthProvider>
          <AccountSync />
          <SmoothScrollProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
            <CartNotice />
          </SmoothScrollProvider>
        </AuthProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}