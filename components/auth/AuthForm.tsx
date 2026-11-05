"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const inputClass =
  "min-h-12 w-full rounded-full border border-forest/10 bg-pearl/92 px-5 outline-none transition focus:border-gold";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, login, signup, loginWithGoogle } = useAuth();

  const rawNext = searchParams.get("next") ?? "/";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(
    searchParams.get("error") === "google" ? "Google sign-in failed. Please try again." : ""
  );

  useEffect(() => {
    if (!loading && user) router.replace(next);
  }, [loading, user, next, router]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (mode === "signup" && !name.trim()) return setError("Please enter your name");
    if (password.length < 8) return setError("Password must be at least 8 characters");

    setSubmitting(true);
    try {
      if (mode === "signup") await signup(name.trim(), email.trim(), password);
      else await login(email.trim(), password);
      router.replace(next);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const isLogin = mode === "login";
  const otherHref = `${isLogin ? "/signup" : "/login"}${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <section className="luxury-container flex min-h-[70vh] items-center justify-center py-16">
      <form
        onSubmit={onSubmit}
        className="grid w-full max-w-md gap-4 rounded-[2rem] bg-pearl/75 p-6 shadow-sm md:p-8"
      >
        <h1 className="font-serif text-4xl text-forest">{isLogin ? "Welcome back" : "Create account"}</h1>
        <p className="text-sm text-moss">
          {isLogin
            ? "Sign in to see your cart and saved pieces on any device."
            : "Save your cart and favourites, and track your orders."}
        </p>

        {!isLogin && (
          <input className={inputClass} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        )}
        <input
          className={inputClass}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={inputClass}
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {isLogin && (
          <Link href="/forgot-password" className="justify-self-end text-sm text-moss underline-offset-2 hover:underline">
            Forgot password?
          </Link>
        )}

        {error && <p className="text-sm text-rose">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="min-h-12 rounded-full bg-forest px-6 text-pearl transition hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
        </button>

        <button
          type="button"
          onClick={loginWithGoogle}
          className="min-h-12 rounded-full border border-forest/15 bg-pearl px-6 text-forest transition hover:border-gold"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm text-moss">
          {isLogin ? "New here? " : "Already have an account? "}
          <Link href={otherHref} className="font-semibold text-forest underline-offset-2 hover:underline">
            {isLogin ? "Create an account" : "Sign in"}
          </Link>
        </p>
      </form>
    </section>
  );
}