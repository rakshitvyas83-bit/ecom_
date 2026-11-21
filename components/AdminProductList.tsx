"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import AdminProductForm from "@/components/AdminProductForm";
import { databases } from "@/lib/appwrite";
import { DATABASE_ID, PRODUCTS_ID } from "@/lib/constants";
import { compareProductsByDisplayOrder } from "@/lib/catalog";
import { listProducts } from "@/lib/products";
import type { Product } from "@/types/product";
import { getProductPrice } from "@/utils/format";

export default function AdminProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  const fetchProducts = async () => {
    const products = await listProducts({ includeInactive: true });
    setProducts(products.sort(compareProductsByDisplayOrder));
  };

  const moveProduct = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (savingOrder || targetIndex < 0 || targetIndex >= products.length) return;

    const reordered = [...products];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    const orderedProducts = reordered.map((product, displayOrder) => ({
      ...product,
      displayOrder
    }));
    const existingOrder = new Map(
      products.map((product) => [product.id, product.displayOrder])
    );

    setSavingOrder(true);
    setProducts(orderedProducts);
    try {
      await Promise.all(
        orderedProducts
          .filter((product) => product.displayOrder !== existingOrder.get(product.id))
          .map((product) =>
            databases.updateDocument(DATABASE_ID, PRODUCTS_ID, product.id, {
              displayOrder: product.displayOrder
            })
          )
      );
    } catch (error) {
      console.error("Failed to save product order", error);
      alert("Could not save product order. Check that the products table has a displayOrder integer column, then try again.");
      await fetchProducts();
    } finally {
      setSavingOrder(false);
    }
  };

  const deleteProduct = async (id: string) => {
    await databases.deleteDocument(DATABASE_ID, PRODUCTS_ID, id);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      {editing && (
        <AdminProductForm
          editProduct={editing}
          onDone={() => {
            setEditing(null);
            fetchProducts();
          }}
        />
      )}

      <div>
        <h2 className="text-lg font-semibold">All Products</h2>
        <p className="mt-1 text-sm text-gray-600">
          Use the arrows to change the order shown by default in the shop.
        </p>
        {savingOrder && <p className="mt-1 text-sm text-gray-600">Saving order…</p>}
      </div>

      {products.map((p, index) => (
        <div key={p.id} className="flex justify-between border p-3 rounded">
          <div>
            <p className="text-sm text-gray-500">Shop position: {index + 1}</p>
            <p>{p.name}</p>
            <p>Rs. {getProductPrice(p)}</p>
            <p className={p.isactive !== false ? "text-sm text-green-600" : "text-sm text-red-600"}>
              {p.isactive !== false ? "Active" : "Inactive"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void moveProduct(index, -1)}
              disabled={savingOrder || index === 0}
              aria-label={`Move ${p.name} up`}
              className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUp size={16} />
            </button>
            <button
              type="button"
              onClick={() => void moveProduct(index, 1)}
              disabled={savingOrder || index === products.length - 1}
              aria-label={`Move ${p.name} down`}
              className="rounded border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowDown size={16} />
            </button>
            <button
              onClick={() => setEditing(p)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => deleteProduct(p.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
