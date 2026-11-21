"use client";

import { useEffect, useState } from "react";
import AdminProductForm from "@/components/AdminProductForm";
import { databases } from "@/lib/appwrite";
import { DATABASE_ID, PRODUCTS_ID } from "@/lib/constants";
import { listProducts } from "@/lib/products";
import type { Product } from "@/types/product";
import { getProductPrice } from "@/utils/format";

export default function AdminProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);

  const fetchProducts = async () => {
    const products = await listProducts({ includeInactive: true });
    setProducts(products);
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

      <h2 className="text-lg font-semibold">All Products</h2>

      {products.map((p) => (
        <div key={p.id} className="flex justify-between border p-3 rounded">
          <div>
            <p>{p.name}</p>
            <p>Rs. {getProductPrice(p)}</p>
            <p className={p.isactive !== false ? "text-sm text-green-600" : "text-sm text-red-600"}>
              {p.isactive !== false ? "Active" : "Inactive"}
            </p>
          </div>

          <div className="flex gap-2">
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
