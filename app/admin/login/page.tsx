"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { hasAdminLabel } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    account.get().then((user) => {
      if (active && hasAdminLabel(user.labels)) router.replace("/admin");
    }).catch(() => {
      // No existing session; remain on the login form.
    });
    return () => {
      active = false;
    };
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const currentUser = await account.get().catch(() => null);
      if (currentUser && hasAdminLabel(currentUser.labels) && currentUser.email === email.trim()) {
        router.replace("/admin");
        return;
      }

      if (currentUser) {
        await account.deleteSession("current");
      }

      await account.createEmailPasswordSession(email, password);

      const user = await account.get();
      if (!hasAdminLabel(user.labels)) {
        await account.deleteSession("current");
        setError("This account does not have the admin label. Sign in with an admin account.");
        return;
      }

      router.replace("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-4 border p-6 rounded-xl"
      >
        <h1 className="text-2xl font-bold">Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}