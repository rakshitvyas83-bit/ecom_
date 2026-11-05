import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import RequireAuth from "@/components/auth/RequireAuth";
import { Suspense } from "react";

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <Suspense fallback={<p>Loading...</p>}>
            <CheckoutClient />
      </Suspense>
    </RequireAuth>
  );
}
