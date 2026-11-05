"use client";

import { useEffect, useRef } from "react";
import { account } from "@/lib/appwrite";
import { useAuth } from "@/context/AuthContext";

const MIN_GAP_MS = 60_000;

// Picks up sessions revoked from another device. When the tab regains focus,
// ask Appwrite if the session is still valid. Only a 401 triggers refresh();
// a network blip must not look like a sign-out, because AccountSync clears
// the local cart when it sees a signed-out state.
export default function SessionWatcher() {
  const { user, refresh } = useAuth();
  const lastCheck = useRef(0);

  useEffect(() => {
    if (!user) return;

    const check = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastCheck.current < MIN_GAP_MS) return;
      lastCheck.current = Date.now();
      account.get().catch((e: { code?: number }) => {
        if (e?.code === 401) refresh();
      });
    };

    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, [user, refresh]);

  return null;
}