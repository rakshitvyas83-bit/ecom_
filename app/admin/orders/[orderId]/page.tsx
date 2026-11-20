"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { hasAdminLabel } from "@/lib/admin-auth";
import { formatCurrency } from "@/utils/format";

interface OrderItem {
  productId: string;
  name?: string;
  image?: string;
  size?: string;
  quantity: number;
  price?: number;
}

interface AdminOrder {
  $id: string;
  $createdAt: string;
  customerName?: string;
  customerEmail: string;
  customerPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  items: OrderItem[];
  total: number;
  paymentStatus?: string;
  status: string;
  courierName?: string;
  awbCode?: string;
}

export default function AdminOrderSummaryPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const orderId = params.orderId;
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { jwt } = await account.createJWT();
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(orderId)}`,
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to load this order.");
      }

      const rawOrder = data.order as Omit<AdminOrder, "items"> & { items: string };
      setOrder({
        ...rawOrder,
        items: JSON.parse(rawOrder.items) as OrderItem[],
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load this order.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    let active = true;
    account.get().then((user) => {
      if (!hasAdminLabel(user.labels)) {
        router.replace("/admin/login");
      } else if (active) {
        void loadOrder();
      }
    }).catch(() => router.replace("/admin/login"));

    return () => {
      active = false;
    };
  }, [loadOrder, router]);

  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/admin/orders" className="text-sm text-moss underline underline-offset-4">
        Back to orders
      </Link>

      {loading ? (
        <p className="py-12 text-forest/70">Loading order summary…</p>
      ) : error ? (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      ) : order ? (
        <>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Order summary</p>
              <h1 className="mt-2 break-all font-serif text-3xl text-forest">{order.$id}</h1>
              <p className="mt-1 text-sm text-forest/60">
                {new Date(order.$createdAt).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="text-sm text-forest">
              <p>Payment: <span className="capitalize">{order.paymentStatus || "—"}</span></p>
              <p className="mt-1">Status: <span className="capitalize">{order.status}</span></p>
            </div>
          </div>

          <section className="mt-8 rounded-2xl border border-forest/10 bg-pearl p-5 shadow-sm sm:p-7">
            <h2 className="font-serif text-2xl text-forest">Products ordered</h2>
            {order.items.length === 0 ? (
              <p className="mt-5 text-sm text-forest/70">No product details were saved with this order.</p>
            ) : (
              <ul className="mt-5 divide-y divide-forest/10">
                {order.items.map((item, index) => (
                  <li
                    key={`${item.productId}-${item.size || "size"}-${index}`}
                    className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center"
                  >
                    <Link
                      href={`/products/${encodeURIComponent(item.productId)}`}
                      className="grid h-28 w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-champagne/30"
                      aria-label={`View ${item.name || "product"} details`}
                    >
                      {item.image ? (
                        <img src={item.image} alt={item.name || "Ordered product"} className="h-full w-full object-cover" />
                      ) : (
                        <span className="grid h-full place-items-center px-2 text-center text-xs text-moss/70">
                          Image unavailable
                        </span>
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${encodeURIComponent(item.productId)}`}
                        className="font-serif text-xl text-forest hover:text-gold hover:underline"
                      >
                        {item.name || "Product"}
                      </Link>
                      <p className="mt-1 text-sm text-forest/65">
                        {item.size ? `Size: ${item.size} · ` : ""}Quantity: {item.quantity}
                      </p>
                      <Link
                        href={`/products/${encodeURIComponent(item.productId)}`}
                        className="mt-2 inline-block text-sm text-moss underline underline-offset-4 hover:text-forest"
                      >
                        View product details
                      </Link>
                    </div>

                    {typeof item.price === "number" && (
                      <p className="font-semibold text-forest">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 border-t border-forest/10 pt-4 text-right">
              <span className="mr-3 text-sm text-forest/65">Order total</span>
              <span className="text-xl font-semibold text-forest">{formatCurrency(order.total)}</span>
            </div>
          </section>

          <section className="mt-6 grid gap-5 rounded-2xl border border-forest/10 bg-pearl p-5 shadow-sm sm:grid-cols-2 sm:p-7">
            <div>
              <h2 className="font-serif text-xl text-forest">Customer</h2>
              <p className="mt-3 text-sm text-forest">{order.customerName || "—"}</p>
              <p className="mt-1 text-sm text-forest/70">{order.customerEmail}</p>
              <p className="mt-1 text-sm text-forest/70">{order.customerPhone || "—"}</p>
            </div>
            <div>
              <h2 className="font-serif text-xl text-forest">Shipping address</h2>
              <p className="mt-3 text-sm leading-6 text-forest/75">
                {[order.address, order.city, order.state, order.pincode].filter(Boolean).join(", ") || "—"}
              </p>
              {order.awbCode && (
                <p className="mt-3 text-sm text-forest/75">
                  {order.courierName ? `${order.courierName}: ` : ""}{order.awbCode}
                </p>
              )}
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
