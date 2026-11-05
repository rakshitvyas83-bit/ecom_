import { account } from "@/lib/appwrite";
import type { Models } from "appwrite";

export type SessionInfo = Models.Session;

// Links inside Appwrite emails point back to these pages.
// The origin must be added under Appwrite > Overview > Platforms (web).
const origin = () =>
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL ?? "";

/* ---------- Sessions ---------- */

export async function listSessions(): Promise<SessionInfo[]> {
  const { sessions } = await account.listSessions();
  // This device first, then newest sign-in first.
  return [...sessions].sort(
    (a, b) =>
      Number(b.current) - Number(a.current) ||
      b.$createdAt.localeCompare(a.$createdAt)
  );
}

export const revokeSession = (sessionId: string) =>
  account.deleteSession(sessionId);

// Appwrite has no "delete others" call, so delete one by one.
export async function revokeOtherSessions() {
  const sessions = await listSessions();
  await Promise.all(
    sessions.filter((s) => !s.current).map((s) => account.deleteSession(s.$id))
  );
}

// Deletes every session, including the current one.
export const revokeAllSessions = () => account.deleteSessions();

/* ---------- Profile ---------- */

export const updateName = (name: string) => account.updateName(name.trim());

/* ---------- Password ---------- */

// oldPassword is empty for accounts created with Google and never given a password.
export const changePassword = (next: string, current?: string) =>
  account.updatePassword(next, current || undefined);

export const sendRecovery = (email: string) =>
  account.createRecovery(email.trim(), `${origin()}/reset-password`);

export const completeRecovery = (
  userId: string,
  secret: string,
  password: string
) => account.updateRecovery(userId, secret, password);

/* ---------- Email verification ---------- */

export const sendVerification = () =>
  account.createVerification(`${origin()}/verify-email`);

export const completeVerification = (userId: string, secret: string) =>
  account.updateVerification(userId, secret);