"use client";

import Link from "next/link";
import { useState } from "react";
import { sendRecovery } from "@/lib/accountApi";
import { errMsg, errorText, input, label, primaryBtn } from "@/components/account/styles";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await sendRecovery(email);
      setSent(true);
    } catch (err) {
      // 404 = no such user. Show the same message so emails can't be probed.
      if ((err as { code?: number }).code === 404) setSent(true);
      else setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 pb-24 pt-32">
      <h1 className="text-2xl text-forest">Reset your password</h1>

      {sent ? (
        <p className="mt-4 text-sm text-forest/70">
          If an account exists for {email}, a reset link is on its way. It can take a minute to arrive.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className={label}>Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} autoComplete="email" />
          </div>
          <button type="submit" disabled={busy} className={primaryBtn}>
            {busy ? "Sending…" : "Send reset link"}
          </button>
          {error && <p className={errorText}>{error}</p>}
        </form>
      )}

      <p className="mt-8 text-sm text-forest/60">
        <Link href="/login" className="underline underline-offset-4">Back to log in</Link>
      </p>
    </main>
  );
}