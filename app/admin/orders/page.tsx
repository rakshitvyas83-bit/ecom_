"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { formatCurrency } from "@/utils/format";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/order-status";

interface OrderItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
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
  status: OrderStatus;
  courierName?: string;
  awbCode?: string;
}

const PAGE_SIZE = 50;

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingOrder, setSavingOrder] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { jwt } = await account.createJWT();
      const query = new URLSearchParams({
        status: statusFilter,
        offset: String(offset),
      });
      const response = await fetch(`/api/admin/orders?${query}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to load orders.");
      }

      const loaded = (data.orders as Array<Omit<AdminOrder, "items"> & { items: string }>).map(
        (order) => ({
          ...order,
          items: JSON.parse(order.items) as OrderItem[],
        })
      );
      setOrders(loaded);
      setTotal(data.total as number);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }, [offset, statusFilter]);

  useEffect(() => {
    let active = true;
    account.get().then((user) => {
      if (!user.labels.includes("admin")) router.replace("/admin/login");
      else if (active) void loadOrders();
    }).catch(() => router.replace("/admin/login"));

    return () => {
      active = false;
    };
  }, [loadOrders, router]);

  async function updateStatus(orderId: string, status: OrderStatus) {
    setSavingOrder(orderId);
    setError("");
    try {
      const { jwt } = await account.createJWT();
      const response = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update order status.");

      setOrders((current) =>
        current.map((order) => order.$id === orderId ? { ...order, status: data.status } : order)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update order status.");
      void loadOrders();
    } finally {
      setSavingOrder(null);
    }
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="text-sm text-moss underline underline-offset-4">
            Back to admin
          </Link>
          <h1 className="mt-2 font-serif text-4xl text-forest">Manage orders</h1>
        </div>
        <label className="grid gap-1 text-sm text-forest">
          Filter by status
          <select
            value={statusFilter}
            onChange={(event) => {
              setOffset(0);
              setStatusFilter(event.target.value);
            }}
            className="rounded-full border border-forest/20 bg-pearl px-4 py-2"
          >
            <option value="all">All orders</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
      </div>

      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-forest/10 bg-pearl shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-mist/70 text-forest">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Order status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest/10">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-forest/70">Loading orders…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-forest/70">No orders found.</td></tr>
            ) : orders.map((order) => (
              <tr key={order.$id} className="align-top text-forest">
                <td className="px-4 py-4">
                  <p className="font-medium">{order.$id}</p>
                  <p className="mt-1 text-xs text-forest/60">
                    {new Date(order.$createdAt).toLocaleString("en-IN")}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p>{order.customerName || "—"}</p>
                  <p className="text-xs text-forest/60">{order.customerEmail}</p>
                  <p className="text-xs text-forest/60">{order.customerPhone || ""}</p>
                  <p className="mt-1 max-w-48 text-xs text-forest/60">
                    {[order.address, order.city, order.state, order.pincode].filter(Boolean).join(", ")}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <details>
                    <summary className="cursor-pointer underline underline-offset-2">
                      {order.items.length} item{order.items.length === 1 ? "" : "s"}
                    </summary>
                    <ul className="mt-2 space-y-1 text-xs">
                      {order.items.map((item, index) => (
                        <li key={`${item.productId}-${item.size}-${index}`}>
                          {item.name} ({item.size}) × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </details>
                  {order.awbCode && (
                    <p className="mt-2 text-xs text-forest/60">
                      {order.courierName}: {order.awbCode}
                    </p>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-semibold">{formatCurrency(order.total)}</td>
                <td className="px-4 py-4 capitalize">{order.paymentStatus || "—"}</td>
                <td className="px-4 py-4">
                  <select
                    aria-label={`Status for order ${order.$id}`}
                    value={order.status}
                    disabled={savingOrder === order.$id}
                    onChange={(event) => {
                      if (ORDER_STATUSES.includes(event.target.value as OrderStatus)) {
                        void updateStatus(order.$id, event.target.value as OrderStatus);
                      }
                    }}
                    className="rounded-full border border-forest/20 bg-white px-3 py-2 capitalize disabled:opacity-60"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-forest/70">
        <span>{total === 0 ? "0 orders" : `${offset + 1}–${Math.min(offset + PAGE_SIZE, total)} of ${total} orders`}</span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={offset === 0 || loading}
            onClick={() => setOffset((current) => Math.max(0, current - PAGE_SIZE))}
            className="rounded-full border border-forest/20 px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={offset + PAGE_SIZE >= total || loading}
            onClick={() => setOffset((current) => current + PAGE_SIZE)}
            className="rounded-full border border-forest/20 px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
