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
  title: "KOTA KARIGARI | Sleek. Simple. KOTA KARIGARI.",
  description:
    "A modern luxury ethnic wear boutique for elegant kurtis, festive wear, and premium everyday pieces."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
            <body>
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