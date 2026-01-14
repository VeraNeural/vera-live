"use client";

import { type FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  async function handleSubmit(e: FormEvent) {
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
          /* SIGNUP FORM */
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
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Start with VERA
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "#a1a1aa",
                marginBottom: 32,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Enter your email to begin. We'll send you a secure link — no password needed.
            </p>

            <form
              onSubmit={handleSubmit}
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
                  boxShadow: loading ? "none" : "0 4px 14px 0 rgba(139, 92, 246, 0.3)",
                }}
              >
                {loading ? "Sending..." : "Continue"}
              </button>
            </form>

            {/* Micro-trust text */}
            <p
              style={{
                fontSize: 13,
                color: "#52525b",
                marginTop: 24,
                textAlign: "center",
              }}
            >
              We don't sell data. Ever.
            </p>

            {/* Terms */}
            <p
              style={{
                fontSize: 12,
                color: "#3f3f46",
                marginTop: 16,
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              By continuing, you agree to our{" "}
              <Link href="/terms" style={{ color: "#71717a", textDecoration: "underline" }}>
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" style={{ color: "#71717a", textDecoration: "underline" }}>
                Privacy Policy
              </Link>
              .
            </p>

            {/* Sign in link */}
            <p
              style={{
                fontSize: 14,
                color: "#71717a",
                marginTop: 32,
                textAlign: "center",
              }}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                style={{
                  color: "#8b5cf6",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Sign in
              </Link>
            </p>
          </div>
        ) : (
          /* SUCCESS STATE */
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
              We sent a secure link to
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
              Click the link in your email to continue.
              <br />
              It may take a moment to arrive.
            </p>

            {/* Resend option */}
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
