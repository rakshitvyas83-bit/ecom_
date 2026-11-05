"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  changePassword, listSessions, revokeAllSessions, revokeOtherSessions,
  revokeSession, type SessionInfo,
} from "@/lib/accountApi";
import {
  card, errMsg, errorText, ghostBtn, input, label, primaryBtn, successText,
} from "./styles";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

export default function SecurityTab() {
  const { refresh } = useAuth();

  // sessions
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState("");

  // password
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [signOutOthers, setSignOutOthers] = useState(true);
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwDone, setPwDone] = useState("");

  const load = useCallback(async () => {
    try {
      setSessions(await listSessions());
      setSessionError("");
    } catch (e) {
      setSessionError(errMsg(e));
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function run(key: string, fn: () => Promise<unknown>) {
    setBusy(key);
    setSessionError("");
    try {
      await fn();
      await load();
    } catch (e) {
      setSessionError(errMsg(e));
    } finally {
      setBusy(null);
    }
  }

  async function onRevokeAll() {
    if (!window.confirm("Sign out of every device, including this one?")) return;
    setBusy("all");
    try {
      await revokeAllSessions();
      await refresh(); // user becomes null; RequireAuth sends you to /login
    } catch (e) {
      setSessionError(errMsg(e));
      setBusy(null);
    }
  }

  async function onChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwDone("");
    if (next.length < 8) return setPwError("New password must be at least 8 characters.");
    if (next !== confirm) return setPwError("The new passwords don't match.");
    setPwBusy(true);
    try {
      await changePassword(next, current);
      if (signOutOthers) await revokeOtherSessions();
      setCurrent("");
      setNext("");
      setConfirm("");
      setPwDone(signOutOthers ? "Password updated. Other devices were signed out." : "Password updated.");
      await load();
    } catch (err) {
      setPwError(errMsg(err));
    } finally {
      setPwBusy(false);
    }
  }

  const others = sessions.filter((s) => !s.current).length;

  return (
    <div className="space-y-6">
      <form onSubmit={onChangePassword} className={card}>
        <h2 className="text-lg text-forest">Change password</h2>

        <div className="mt-5 max-w-sm space-y-4">
          <div>
            <label htmlFor="current" className={label}>Current password</label>
            <input id="current" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} className={input} autoComplete="current-password" />
            <p className="mt-1 text-xs text-forest/60">Leave empty if you signed up with Google and never set one.</p>
          </div>
          <div>
            <label htmlFor="next" className={label}>New password</label>
            <input id="next" type="password" value={next} onChange={(e) => setNext(e.target.value)} className={input} autoComplete="new-password" />
          </div>
          <div>
            <label htmlFor="confirm" className={label}>Confirm new password</label>
            <input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={input} autoComplete="new-password" />
          </div>
          <label className="flex items-center gap-2 text-sm text-forest/80">
            <input type="checkbox" checked={signOutOthers} onChange={(e) => setSignOutOthers(e.target.checked)} className="accent-forest" />
            Sign out of my other devices
          </label>
        </div>

        <button type="submit" disabled={pwBusy} className={`${primaryBtn} mt-6`}>
          {pwBusy ? "Updating…" : "Update password"}
        </button>
        {pwError && <p className={`${errorText} mt-4`}>{pwError}</p>}
        {pwDone && <p className={`${successText} mt-4`}>{pwDone}</p>}
      </form>

      <section className={card}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg text-forest">Where you&apos;re signed in</h2>
            <p className="mt-1 text-sm text-forest/60">If you don&apos;t recognise a device, sign it out and change your password.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {others > 0 && (
              <button onClick={() => run("others", revokeOtherSessions)} disabled={busy !== null} className={ghostBtn}>
                {busy === "others" ? "Signing out…" : "Sign out other devices"}
              </button>
            )}
            <button onClick={onRevokeAll} disabled={busy !== null} className={ghostBtn}>
              {busy === "all" ? "Signing out…" : "Sign out everywhere"}
            </button>
          </div>
        </div>

        {loadingSessions ? (
          <p className="mt-6 text-sm text-forest/60">Loading sessions…</p>
        ) : (
          <ul className="mt-4 divide-y divide-forest/10">
            {sessions.map((s) => (
              <li key={s.$id} className="flex items-start justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-forest">
                    {[s.clientName, s.osName].filter(Boolean).join(" on ") || "Unknown device"}
                    {s.current && (
                      <span className="ml-2 rounded-full bg-moss/15 px-2 py-0.5 text-xs font-normal text-moss">This device</span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-forest/60">
                    {[s.countryName, s.ip].filter(Boolean).join(", ")}
                    {s.countryName || s.ip ? ". " : ""}
                    Signed in {fmt(s.$createdAt)}
                    {s.provider === "google" ? " with Google" : ""}
                  </p>
                </div>
                {!s.current && (
                  <button onClick={() => run(s.$id, () => revokeSession(s.$id))} disabled={busy !== null} className={ghostBtn}>
                    {busy === s.$id ? "Signing out…" : "Sign out"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        {sessionError && <p className={`${errorText} mt-4`}>{sessionError}</p>}
      </section>
    </div>
  );
}