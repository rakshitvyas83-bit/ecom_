"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/auth/RequireAuth";
import ProfileTab from "@/components/account/ProfileTab";
import SecurityTab from "@/components/account/SecurityTab";
import { card, ghostBtn } from "@/components/account/styles";
import { useAuth } from "@/context/AuthContext";

const TABS = [
  { id: "orders", label: "Orders" },
  { id: "saved", label: "Saved" },
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
] as const;
type TabId = (typeof TABS)[number]["id"];

function AccountContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  // Switch the default to "orders" once stage 6 (orders list) is in.
  const [tab, setTab] = useState<TabId>("profile");

  async function onLogout() {
    await logout();
    router.replace("/");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl text-forest">{user?.name || "Your account"}</h1>
          <p className="mt-1 text-sm text-forest/60">{user?.email}</p>
        </div>
        <button onClick={onLogout} className={ghostBtn}>Log out</button>
      </div>

      <nav className="mt-8 flex gap-6 overflow-x-auto border-b border-forest/10" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px whitespace-nowrap border-b-2 pb-3 text-sm transition-colors ${
              tab === t.id ? "border-forest text-forest" : "border-transparent text-forest/60 hover:text-forest"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === "orders" && (
          <div className={card}>
            <p className="text-sm text-forest/70">Your orders will appear here once orders are linked to accounts.</p>
          </div>
        )}
        {tab === "saved" && (
          <div className={card}>
            <p className="mb-4 text-sm text-forest/70">Products you&apos;ve saved follow you to every device you sign in on.</p>
            <Link href="/wishlist" className={ghostBtn}>Open saved products</Link>
          </div>
        )}
        {tab === "profile" && <ProfileTab />}
        {tab === "security" && <SecurityTab />}
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <RequireAuth>
      <AccountContent />
    </RequireAuth>
  );
}