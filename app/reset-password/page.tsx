"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { completeRecovery } from "@/lib/accountApi";
import { errMsg, errorText, input, label, primaryBtn } from "@/components/account/styles";

function ResetForm() {
  const params = useSearchParams();
  const userId = params.get("userId");
  const secret = params.get("secret");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!userId || !secret) {
    return (
      <p className="mt-4 text-sm text-forest/70">
        This reset link is incomplete or has expired.{" "}
        <Link href="/forgot-password" className="underline underline-offset-4">Request a new one</Link>.
      </p>
    );
  }

  if (done) {
    return (
      <p className="mt-4 text-sm text-forest/70">
        Password updated. <Link href="/login" className="underline underline-offset-4">Log in</Link> with your new password.
      </p>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("The passwords don't match.");
    setBusy(true);
    try {
      await completeRecovery(userId!, secret!, password);
      setDone(true);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="password" className={label}>New password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} autoComplete="new-password" />
      </div>
      <div>
        <label htmlFor="confirm" className={label}>Confirm new password</label>
        <input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={input} autoComplete="new-password" />
      </div>
      <button type="submit" disabled={busy} className={primaryBtn}>
        {busy ? "Saving…" : "Set new password"}
      </button>
      {error && <p className={errorText}>{error}</p>}
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto max-w-md px-6 pb-24 pt-32">
      <h1 className="text-2xl text-forest">Choose a new password</h1>
      <Suspense fallback={null}>
        <ResetForm />
      </Suspense>
    </main>
  );
}