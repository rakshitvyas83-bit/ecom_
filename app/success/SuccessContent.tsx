"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const cartSyncFailed = searchParams.get("cartSync") === "failed";

  return (
    <main className="flex min-h-[65vh] items-center justify-center px-4 py-16">
      <section className="w-full max-w-xl rounded-[2rem] border border-forest/10 bg-pearl/85 p-8 text-center shadow-luxury sm:p-12">
        <CheckCircle2 className="mx-auto text-green-700" size={56} aria-hidden="true" />
        <h1 className="mt-5 font-serif text-4xl text-forest">Order placed!</h1>
        <p className="mt-3 text-forest/75">
          Thank you for your order. Your order has been confirmed.
        </p>
        <p className="mt-2 text-sm text-forest/70">
          Your tracking ID will be shared with you via WhatsApp or email shortly.
        </p>

        {orderId && (
          <p className="mt-6 text-sm text-forest/60">
            Order ID: <span className="font-mono text-forest">{orderId}</span>
          </p>
        )}

        {cartSyncFailed && (
          <p role="status" className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
            Your order is confirmed, but we couldn&apos;t sync the empty cart to your account. Please refresh your cart before placing another order.
          </p>
        )}

        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-6 text-sm font-medium text-pearl transition hover:opacity-90"
        >
          Continue shopping
        </Link>
      </section>
    </main>
  );
}
