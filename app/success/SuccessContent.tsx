"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, Circle, Truck } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { getTrackingTimeline } from "@/lib/mockShipping";

interface OrderItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  $id: string;
  $createdAt: string;
  customerName: string;
  total: number;
  items: OrderItem[];
  courierName?: string;
  awbCode?: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const cartSyncFailed = searchParams.get("cartSync") === "failed";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0); // forces re-render so timeline updates live

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError(true);
      return;
    }

    fetch(`/api/order/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrder(data.order);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [orderId]);

  // Re-check the tracking status every 15 seconds so you can watch
  // it progress live during testing without refreshing the page.
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-3xl font-bold">Order Confirmation Unavailable</h1>
        <p className="text-gray-600">
          We couldn&apos;t find details for this order.
        </p>
        <Link href="/" className="underline">
          Return home
        </Link>
      </div>
    );
  }

  const timeline = getTrackingTimeline(order.$createdAt);
  void tick; // referenced so effect dependency isn't flagged as unused

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold">Order Successful 🎉</h1>

        <p className="mt-4 text-gray-600">Thank you for shopping with us.</p>
        {cartSyncFailed && (
          <p role="status" className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
            Your order is confirmed, but we couldn&apos;t sync the empty cart to your account. Please refresh your cart before placing another order.
          </p>
        )}

        <p className="mt-2 text-sm text-gray-500">
          Order ID: <span className="font-mono">{order.$id}</span>
        </p>

        {/* Tracking section */}
        {order.awbCode && (
          <div className="mt-8 rounded-2xl border border-gray-200 p-5 text-left">
            <div className="flex items-center gap-2">
              <Truck size={20} />
              <p className="font-semibold">
                Shipped via {order.courierName}
              </p>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Tracking ID:{" "}
              <span className="font-mono">{order.awbCode}</span>
            </p>

            <div className="mt-5 space-y-3">
              {timeline.steps.map((step) => (
                <div key={step.status} className="flex items-center gap-3">
                  {step.completed ? (
                    <CheckCircle2 size={18} className="text-green-600" />
                  ) : (
                    <Circle size={18} className="text-gray-300" />
                  )}
                  <span
                    className={
                      step.completed
                        ? "font-medium text-black"
                        : "text-gray-400"
                    }
                  >
                    {step.status}
                  </span>
                  {step.timestamp && (
                    <span className="ml-auto text-xs text-gray-400">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-gray-400">
              Status updates automatically — this is a simulated tracking
              flow for testing.
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-4 text-left">
          {order.items.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 rounded-xl object-cover"
              />

              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Size: {item.size} · Qty: {item.quantity}
                </p>
              </div>

              <span className="whitespace-nowrap font-medium">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between border-t border-gray-200 pt-4 text-lg font-semibold">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-white"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}