"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, Gift, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import {
  getCartSubtotal,
  getStoredBuyNowItem,
  useCartStore
} from "@/store/cart-store";
import { formatCurrency } from "@/utils/format";
import { account } from "@/lib/appwrite";
import { useAuth } from "@/context/AuthContext";
import { saveServerCart } from "@/lib/cartApi";

const inputClass =
  "min-h-12 rounded-full border border-forest/10 bg-pearl/92 px-5 outline-none transition focus:border-gold";

export function CheckoutClient() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const items = useCartStore((state) => state.items);
  const buyNowItem = useCartStore((state) => state.buyNowItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearBuyNowItem = useCartStore((state) => state.clearBuyNowItem);
  const checkoutMode = useCartStore((state) => state.checkoutMode);
  const [storedBuyNowItem, setStoredBuyNowItem] = useState<ReturnType<
    typeof getStoredBuyNowItem
  >>(null);
  const [buyNowReady, setBuyNowReady] = useState(false);

  const isBuyNowCheckout =
    searchParams.get("mode") === "buy-now" || checkoutMode === "buyNow";

  const checkoutItems = useMemo(
    () =>
      isBuyNowCheckout
        ? buyNowItem
          ? [buyNowItem]
          : storedBuyNowItem
            ? [storedBuyNowItem]
            : []
        : items,
    [buyNowItem, isBuyNowCheckout, items, storedBuyNowItem]
  );

  const subtotal = getCartSubtotal(checkoutItems);

  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 180;

  const totalPrice = subtotal + shipping;

  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<
    "idle" | "checking" | "valid" | "invalid" | "error"
  >("idle");
  const [pincodeMessage, setPincodeMessage] = useState("");

  useEffect(() => {
    if (isBuyNowCheckout) {
      const item = buyNowItem ?? getStoredBuyNowItem();
      setStoredBuyNowItem(item);
      // Set ready immediately after state update is scheduled
      setBuyNowReady(true);
      return;
    }
    setBuyNowReady(false);
    setStoredBuyNowItem(null);
  }, [buyNowItem, isBuyNowCheckout]);

  useEffect(() => {
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeStatus("idle");
      setPincodeMessage("");
      return;
    }

    const controller = new AbortController();
    setPincodeStatus("checking");
    setPincodeMessage("Verifying PIN code…");
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/pincode?pincode=${encodeURIComponent(pincode)}`,
          { signal: controller.signal }
        );
        const result = await response.json();
        if (controller.signal.aborted) return;
        if (!response.ok) {
          setPincodeStatus(response.status === 404 || response.status === 400 ? "invalid" : "error");
          setPincodeMessage(result.error || "Could not verify this PIN code. Please try again.");
          return;
        }

        setCity(result.city);
        setStateName(result.state);
        setPincodeStatus("valid");
        setPincodeMessage("PIN code verified. City and state filled automatically.");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("PIN code verification request failed:", error);
        setPincodeStatus("error");
        setPincodeMessage("Could not verify this PIN code. Please try again.");
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [pincode]);

  const handlePayment = async () => {
    setPaymentError("");
    try {
      if (
  !customerName ||
  !customerEmail ||
  !customerPhone ||
  !city ||
  !address ||
  !stateName ||
  !pincode
) {
  setPaymentError("Please fill all shipping details.");
  return;
}

if (pincodeStatus !== "valid") {
  setPaymentError("Please enter and verify a valid Indian PIN code.");
  return;
}

if (!/^\d{10}$/.test(customerPhone)) {
  setPaymentError("Please enter a valid 10-digit phone number.");
  return;
}

setLoading(true);

      const { jwt } = await account.createJWT();
      const response = await fetch("/api/create-order", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },

        body: JSON.stringify({
          amount: totalPrice,
        }),
      });

      const order = await response.json();
      if (!response.ok) {
        throw new Error(order.error || "Unable to create your order. Please try again.");
      }
      if (!order.id || !order.amount || !order.currency) {
        throw new Error("The payment service returned an invalid order. Please try again.");
      }
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        throw new Error("Online payments are not configured. Please contact the store.");
      }
      if (!(window as any).Razorpay) {
        throw new Error("The payment service did not load. Check your connection and try again.");
      }

      let paymentFailed = false;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        name: "Kota Karigari",

        description: "Order Payment",

        order_id: order.id,

        handler: async function (response: any) {
  try {
    const { jwt } = await account.createJWT();
    const verifyResponse = await fetch(
      "/api/verify-payment",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },

        body: JSON.stringify({
          ...response,

          customerName,
          customerEmail,
          customerPhone,

          city,
          address,
          stateName,
          pincode,

          items: checkoutItems,

          total: totalPrice,
        }),
      }
    );

    const data = await verifyResponse.json();

if (data.success) {
  clearBuyNowItem();
  let cartSyncFailed = false;
  if (!isBuyNowCheckout) {
    clearCart();
    try {
      if (!user) throw new Error("The signed-in account is unavailable.");
      await saveServerCart(user.$id, []);
    } catch (error) {
      cartSyncFailed = true;
      console.error("Order succeeded, but the account cart could not be cleared:", error);
    }
  }
  window.location.href = `/success?orderId=${encodeURIComponent(data.orderId)}${
    cartSyncFailed ? "&cartSync=failed" : ""
  }`;
} else {
      setPaymentError(
        data.error ||
          "We couldn't confirm your order. If your payment went through, do not pay again; contact support."
      );
    }
  } catch (error) {
    console.error("Payment verification request failed:", error);
    setPaymentError(
      "We couldn't confirm your order. If your payment went through, do not pay again; contact support."
    );
  }
},

        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },

        notes: {
          address,
          city,
          state: stateName,
          pincode,
        },

        theme: {
          color: "#4F2432",
        },
        modal: {
          ondismiss: () => {
            if (!paymentFailed) {
              setPaymentError("Payment was cancelled. No payment was completed.");
            }
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        paymentFailed = true;
        console.error("Razorpay payment failed:", response.error);
        setPaymentError(
          response.error?.description || "Payment could not be completed. Please try again."
        );
      });
      razorpay.open();
    } catch (error) {
      console.error(error);
      setPaymentError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="luxury-container py-14">
      <h1 className="font-serif text-5xl">Checkout</h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
        <form className="grid gap-8">
          <section className="rounded-[2rem] bg-pearl/75 p-6 shadow-sm md:p-8">
            <h2 className="font-serif text-3xl">
              Shipping Details
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                className={inputClass}
                placeholder="Full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <input
                className={inputClass}
                placeholder="Email address"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />

              <input
  className={inputClass}
  placeholder="Phone number"
  value={customerPhone}
  maxLength={10}
  inputMode="numeric"
  onChange={(e) =>
    setCustomerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
  }
/>

              <input
                className={inputClass}
                placeholder="City / District"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoComplete="address-level2"
              />

              <input
                className={`${inputClass} md:col-span-2`}
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <input
                className={inputClass}
                placeholder="State"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                autoComplete="address-level1"
              />

              <div className="grid gap-2">
                <input
                  className={inputClass}
                  placeholder="PIN code"
                  value={pincode}
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  aria-describedby="pincode-status"
                  aria-invalid={pincodeStatus === "invalid"}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setPincode(value);
                    setCity("");
                    setStateName("");
                  }}
                />
                <p
                  id="pincode-status"
                  aria-live="polite"
                  className={`min-h-5 px-2 text-xs ${
                    pincodeStatus === "valid"
                      ? "text-green-700"
                      : pincodeStatus === "invalid" || pincodeStatus === "error"
                        ? "text-red-700"
                        : "text-moss"
                  }`}
                >
                  {pincodeStatus === "checking"
                    ? "Verifying PIN code…"
                    : pincodeMessage || (pincode.length > 0 && pincode.length < 6
                      ? "Enter a six-digit Indian PIN code."
                      : "")}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-pearl/75 p-6 shadow-sm md:p-8">
            <h2 className="font-serif text-3xl">
              Payment Method
            </h2>

            <div className="mt-5 grid gap-3">
              <label className="flex items-center gap-3 rounded-2xl border border-gold bg-mist/70 p-4">
                <input type="radio" checked readOnly />

                <CreditCard size={19} />

                Razorpay / UPI / Card
              </label>
            </div>

            <p className="mt-4 text-sm text-moss">
              Secure payments powered by Razorpay.
            </p>
          </section>
        </form>

        <aside className="h-fit rounded-[2rem] bg-forest p-7 text-pearl shadow-luxury">
          <h2 className="font-serif text-3xl">
            Order Summary
          </h2>

          <div className="mt-5 grid gap-4">
            {isBuyNowCheckout && !buyNowReady ? (
              <p className="text-sm text-pearl/70">
                Loading selected item...
              </p>
            ) : checkoutItems.length === 0 ? (
              <p className="text-sm text-pearl/70">
                No items selected yet.
              </p>
            ) : (
              checkoutItems.map((item) => (
  <div
    key={`${item.productId}-${item.size}`}
    className="flex items-center justify-between gap-3 text-sm"
  >
    <div className="flex items-center gap-3">
      <Link href={`/products/${item.productId}`} className="shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="h-14 w-14 rounded-xl object-cover"
        />
      </Link>

      <div>
        <Link
          href={`/products/${item.productId}`}
          className="font-medium text-pearl hover:text-gold hover:underline"
        >
          {item.name}
        </Link>
        <p className="text-xs text-pearl/60">
          Size: {item.size} · Qty: {item.quantity}
        </p>
      </div>
    </div>

    <span className="whitespace-nowrap">
      {formatCurrency(item.price * item.quantity)}
    </span>
  </div>
))
            )}
          </div>

          <div className="mt-6 flex gap-2 rounded-full bg-pearl/10 p-2">
            <Gift className="ml-2 mt-3" size={18} />

            <input
              placeholder="Coupon code"
              className="min-h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-pearl/55"
            />

            <button
              className="rounded-full bg-pearl px-4 text-sm font-semibold text-forest"
            >
              Apply
            </button>
          </div>

          <div className="mt-6 grid gap-3 border-t border-pearl/15 pt-5 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>

              <span>
                {shipping === 0
                  ? "Complimentary"
                  : formatCurrency(shipping)}
              </span>
            </div>

            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>

              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={handlePayment}
            disabled={(isBuyNowCheckout && !buyNowReady) || checkoutItems.length === 0 || loading}
            className="mt-7 w-full bg-pearl text-forest hover:bg-champagne"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Processing...
              </span>
            ) : (
              "Pay Now"
            )}
          </Button>

          {paymentError && (
            <p role="alert" className="mt-4 text-sm text-red-200">
              {paymentError}
            </p>
          )}

          <p className="mt-4 text-xs leading-5 text-pearl/62">
            Secure checkout powered by Razorpay.
          </p>
        </aside>
      </div>
    </div>
  );
}
