"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { completeVerification } from "@/lib/accountApi";
import { errMsg } from "@/components/account/styles";

function VerifyContent() {
  const params = useSearchParams();
  const { refresh } = useAuth();
  const started = useRef(false); // the secret is single-use, so Strict Mode must not run this twice
  const [state, setState] = useState<"working" | "done" | "error">("working");
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const userId = params.get("userId");
    const secret = params.get("secret");
    if (!userId || !secret) {
      setState("error");
      setError("This verification link is incomplete.");
      return;
    }
    completeVerification(userId, secret)
      .then(() => {
        setState("done");
        refresh();
      })
      .catch((e) => {
        setState("error");
        setError(errMsg(e));
      });
  }, [params, refresh]);

  if (state === "working") return <p className="mt-4 text-sm text-forest/70">Verifying your email…</p>;
  if (state === "done")
    return (
      <p className="mt-4 text-sm text-forest/70">
        Your email is verified. <Link href="/account" className="underline underline-offset-4">Go to your account</Link>.
      </p>
    );
  return (
    <p className="mt-4 text-sm text-red-700">
      {error} You can send a new link from the Profile tab of your account.
    </p>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="mx-auto max-w-md px-6 pb-24 pt-32">
      <h1 className="text-2xl text-forest">Email verification</h1>
      <Suspense fallback={null}>
        <VerifyContent />
      </Suspense>
    </main>
  );
}