"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { sendVerification, updateName } from "@/lib/accountApi";
import {
  card, errMsg, errorText, ghostBtn, input, label, primaryBtn, successText,
} from "./styles";

export default function ProfileTab() {
  const { user, refresh } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  if (!user) return null;

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDone("");
    if (!name.trim()) return setError("Enter your name.");
    setSaving(true);
    try {
      await updateName(name);
      await refresh();
      setDone("Name saved.");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setSaving(false);
    }
  }

  async function onVerify() {
    setError("");
    setDone("");
    setSending(true);
    try {
      await sendVerification();
      setDone("Verification email sent. Open the link in it to finish.");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSave} className={card}>
        <h2 className="text-lg text-forest">Your details</h2>

        <div className="mt-5 max-w-sm">
          <label htmlFor="name" className={label}>Name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={input} autoComplete="name" />
        </div>

        <div className="mt-5 max-w-sm">
          <p className={label}>Email</p>
          <p className="text-sm text-forest">{user.email}</p>
          <p className="mt-1 text-xs text-forest/60">
            {user.emailVerification ? "Verified" : "Not verified yet"}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={saving} className={primaryBtn}>
            {saving ? "Saving…" : "Save name"}
          </button>
          {!user.emailVerification && (
            <button type="button" onClick={onVerify} disabled={sending} className={ghostBtn}>
              {sending ? "Sending…" : "Send verification email"}
            </button>
          )}
        </div>

        {error && <p className={`${errorText} mt-4`}>{error}</p>}
        {done && <p className={`${successText} mt-4`}>{done}</p>}
      </form>

      <p className="text-xs text-forest/60">
        Account created {new Date(user.$createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
      </p>
    </div>
  );
}