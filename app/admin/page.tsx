"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminProductForm from "@/components/AdminProductForm";
import AdminProductList from "@/components/AdminProductList";
import Link from "next/link";

import { account } from "@/lib/appwrite";

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const checkUser = useCallback(async () => {
    try {
      const user = await account.get();
      if (!user.labels.includes("admin")) {
        router.replace("/admin/login");
        return;
      }
      setLoading(false);
    } catch (error) {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    void checkUser();
  }, [checkUser]);

  const handleLogout = async () => {
  try {
    await account.deleteSessions();
    router.push("/admin/login");
  } catch (error) {
    console.error(error);
  }
};

  if (loading) {
    return (
      <div className="p-6">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Panel</h1>

        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="rounded bg-forest px-4 py-2 text-white">
            Manage orders
          </Link>
          <button
            onClick={handleLogout}
            className="rounded bg-red-500 px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <AdminProductForm />
      <AdminProductList />
    </div>
  );
}