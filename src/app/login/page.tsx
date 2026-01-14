"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  // Magic link sign in
  async function handleMagicLink(e: FormEvent) {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Password sign in
  async function handlePasswordLogin(e: FormEvent) {
    e.preventDefault();
    if (!email || !password || loading) return;

    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0f",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          height: 64,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "0.5px",
            color: "white",
            textDecoration: "none",
          }}
        >
          VERA
        </Link>
      </header>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          paddingBottom: 80,
        }}
      >
        {/* ORB - smaller, subtle */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #c4b5fd, #7c3aed)",
            marginBottom: 40,
            boxShadow: "0 0 40px 10px rgba(139, 92, 246, 0.15)",
          }}
        />

        {!sent ? (
          /* LOGIN FORM */
          <div
            style={{
              width: "100%",
              maxWidth: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                fontSize: 32,
                fontWeight: 600,
                marginBottom: 32,
                textAlign: "center",
              }}
            >
              Welcome back
            </h1>

            {!showPassword ? (
              /* MAGIC LINK FORM */
              <form
                onSubmit={handleMagicLink}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  required
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: "1px solid #27272a",
                    background: "#14141a",
                    color: "white",
                    fontSize: 16,
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#8b5cf6";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#27272a";
                  }}
                />

                {error && (
                  <p
                    style={{
                      color: "#f87171",
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "16px 24px",
                    borderRadius: 12,
                    background: loading
                      ? "#4c1d95"
                      : "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                    color: "white",
                    border: "none",
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: loading
                      ? "none"
                      : "0 4px 14px 0 rgba(139, 92, 246, 0.3)",
                  }}
                >
                  {loading ? "Sending..." : "Send sign-in link"}
                </button>

                {/* Password option */}
                <button
                  type="button"
                  onClick={() => setShowPassword(true)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#71717a",
                    fontSize: 14,
                    cursor: "pointer",
                    padding: "8px",
                    marginTop: 4,
                  }}
                >
                  Or sign in with password
                </button>
              </form>
            ) : (
              /* PASSWORD FORM */
              <form
                onSubmit={handlePasswordLogin}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  required
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: "1px solid #27272a",
                    background: "#14141a",
                    color: "white",
                    fontSize: 16,
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#8b5cf6";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#27272a";
                  }}
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: "1px solid #27272a",
                    background: "#14141a",
                    color: "white",
                    fontSize: 16,
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#8b5cf6";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#27272a";
                  }}
                />

                {error && (
                  <p
                    style={{
                      color: "#f87171",
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "16px 24px",
                    borderRadius: 12,
                    background: loading
                      ? "#4c1d95"
                      : "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                    color: "white",
                    border: "none",
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: loading
                      ? "none"
                      : "0 4px 14px 0 rgba(139, 92, 246, 0.3)",
                  }}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>

                {/* Back to magic link */}
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(false);
                    setError("");
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#71717a",
                    fontSize: 14,
                    cursor: "pointer",
                    padding: "8px",
                    marginTop: 4,
                  }}
                >
                  Use email link instead
                </button>

                {/* Forgot password */}
                <Link
                  href="/forgot-password"
                  style={{
                    color: "#71717a",
                    fontSize: 13,
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </Link>
              </form>
            )}

            {/* Sign up link */}
            <p
              style={{
                fontSize: 14,
                color: "#71717a",
                marginTop: 32,
                textAlign: "center",
              }}
            >
              New to VERA?{" "}
              <Link
                href="/signup"
                style={{
                  color: "#8b5cf6",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Start free
              </Link>
            </p>
          </div>
        ) : (
          /* SUCCESS STATE - Email sent */
          <div
            style={{
              width: "100%",
              maxWidth: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Checkmark */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
                boxShadow: "0 4px 20px 0 rgba(139, 92, 246, 0.3)",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h1
              style={{
                fontSize: 28,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              Check your email
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "#a1a1aa",
                lineHeight: 1.6,
                marginBottom: 8,
              }}
            >
              We sent a sign-in link to
            </p>
            <p
              style={{
                fontSize: 16,
                color: "#ffffff",
                fontWeight: 500,
                marginBottom: 24,
              }}
            >
              {email}
            </p>
            <p
              style={{
                fontSize: 14,
                color: "#71717a",
                lineHeight: 1.6,
              }}
            >
              Click the link in your email to sign in.
              <br />
              It may take a moment to arrive.
            </p>

            {/* Back option */}
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
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Use a different email
            </button>
          </div>
        )}
      </div>
    </main>
  );
}