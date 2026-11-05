"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Client-side guard. Appwrite's web SDK keeps the session in localStorage,
// so middleware.ts can't see it. Wrap any /account/* page in this instead.
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  // Keep rendering while a background refresh runs, so the page doesn't flash.
  if (!user) return <div className="min-h-[60vh]" aria-busy="true" />;
  return <>{children}</>;
}