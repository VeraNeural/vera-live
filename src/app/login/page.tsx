"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // 🔒 STEP 5 — if already logged in, never show login
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = "/";
      }
    });
  }, []);

  async function handleEmailLogin(e: FormEvent) {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }

    setLoading(false);
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0f",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {!sent ? (
        <form
          onSubmit={handleEmailLogin}
          style={{
            width: "100%",
            maxWidth: 420,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: 32, fontWeight: 600 }}>Continue to VERA</h1>

          <input
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "16px 20px",
              borderRadius: 12,
              border: "1px solid #27272a",
              background: "#14141a",
              color: "white",
              fontSize: 16,
            }}
          />

          {error && (
            <p style={{ color: "#f87171", fontSize: 14 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "16px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
              color: "white",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? "Sending…" : "Continue with Email"}
          </button>

          <div style={{ margin: "16px 0", color: "#71717a" }}>or</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              padding: "14px",
              borderRadius: 12,
              background: "#14141a",
              color: "white",
              border: "1px solid #27272a",
              cursor: "pointer",
            }}
          >
            Continue with Google
          </button>

          <p style={{ fontSize: 12, color: "#52525b", marginTop: 12 }}>
            No passwords. No data selling. Ever.
          </p>
        </form>
      ) : (
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600 }}>Check your email</h1>
          <p style={{ color: "#a1a1aa", marginTop: 12 }}>
            We sent a secure sign-in link to
          </p>
          <p style={{ fontWeight: 500, marginTop: 8 }}>{email}</p>

          <button
            onClick={() => {
              setSent(false);
              setEmail("");
            }}
            style={{
              marginTop: 32,
              padding: "12px 24px",
              borderRadius: 10,
              background: "transparent",
              color: "#8b5cf6",
              border: "1px solid #27272a",
              cursor: "pointer",
            }}
          >
            Use a different email
          </button>
        </div>
      )}
    </main>
  );
}
