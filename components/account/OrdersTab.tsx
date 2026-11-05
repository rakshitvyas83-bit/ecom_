"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { account } from "@/lib/appwrite";
import { formatCurrency } from "@/utils/format";
import { card, errorText } from "./styles";

interface OrderItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
}

interface AccountOrder {
  $id: string;
  $createdAt: string;
  total: number;
  paymentStatus?: string;
  items: OrderItem[];
}

export default function OrdersTab() {
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      try {
        const { jwt } = await account.createJWT();
        const response = await fetch("/api/account/orders", {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Unable to load your orders.");
        }

        const loadedOrders = (
          data.orders as Array<Omit<AccountOrder, "items"> & { items: string }>
        ).map((order) => ({
          ...order,
          items: JSON.parse(order.items) as OrderItem[],
        }));
        if (!cancelled) setOrders(loadedOrders);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load your orders.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className={card} aria-busy="true">Loading your orders…</div>;
  }

  if (error) {
    return <p role="alert" className={errorText}>{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <div className={card}>
        <p className="text-sm text-forest/70">No orders are linked to this account yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <section key={order.$id} className={card}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-medium text-forest">Order {order.$id}</h2>
              <p className="mt-1 text-sm text-forest/60">
                {new Date(order.$createdAt).toLocaleDateString("en-IN", {
                  dateStyle: "medium",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-forest">{formatCurrency(order.total)}</p>
              <p className="mt-1 text-sm capitalize text-forest/60">
                {order.paymentStatus || "Processing"}
              </p>
            </div>
          </div>
          <details className="mt-4 border-t border-forest/10 pt-4">
            <summary className="cursor-pointer text-sm font-medium text-forest underline underline-offset-4">
              View order summary
            </summary>
            <ul className="mt-3 divide-y divide-forest/10">
              {order.items.map((item, index) => (
                <li
                  key={`${item.productId}-${item.size}-${index}`}
                  className="flex justify-between gap-4 py-3 text-sm"
                >
                  <span className="text-forest/80">
                    {item.productId ? (
                      <Link
                        href={`/products/${encodeURIComponent(item.productId)}`}
                        className="font-medium text-forest underline underline-offset-2 hover:text-moss"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <span className="font-medium text-forest">{item.name}</span>
                    )}
                    <span> · {item.size} × {item.quantity}</span>
                  </span>
                  <span className="shrink-0 text-forest">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-forest/10 pt-3 text-sm font-semibold text-forest">
              <span>Order total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </details>
        </section>
      ))}
    </div>
  );
}
