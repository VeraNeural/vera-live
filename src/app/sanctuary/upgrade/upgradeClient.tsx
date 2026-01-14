"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { SANCTUARY_PREVIEW } from "@/lib/auth/gateMessages";

export default function SanctuaryUpgradeClient() {
  const { isLoggedIn, tier, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    if (authLoading) return;
    if (tier !== "sanctuary") return;
    router.push("/");
  }, [authLoading, tier, router]);

  async function handleUpgrade() {
    if (!isLoggedIn) {
      router.push("/signup?redirect=/sanctuary/upgrade");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
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
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #c4b5fd, #7c3aed)",
            marginBottom: 32,
            boxShadow: "0 0 60px 20px rgba(139, 92, 246, 0.25)",
          }}
        />

        <div
          style={{
            padding: "6px 16px",
            borderRadius: 20,
            background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "1px",
            marginBottom: 24,
          }}
        >
          SANCTUARY
        </div>

        <h1
          style={{
            fontSize: 36,
            fontWeight: 600,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          {SANCTUARY_PREVIEW.title}
        </h1>

        <p
          style={{
            fontSize: 16,
            color: "#a1a1aa",
            marginBottom: 32,
            textAlign: "center",
            maxWidth: 480,
            lineHeight: 1.6,
          }}
        >
          {SANCTUARY_PREVIEW.description}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 40,
            width: "100%",
            maxWidth: 360,
          }}
        >
          {SANCTUARY_PREVIEW.features.map((feature, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: "#14141a",
                borderRadius: 12,
                border: "1px solid #27272a",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="12"
                  height="12"
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
              <span style={{ fontSize: 15, color: "#e4e4e7" }}>{feature}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 48, fontWeight: 700 }}>$12</span>
          <span style={{ fontSize: 18, color: "#71717a" }}>/month</span>
        </div>

        {canceled && (
          <p
            style={{
              color: "#a1a1aa",
              fontSize: 14,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            No worries — you can upgrade whenever you're ready.
          </p>
        )}

        {error && (
          <p
            style={{
              color: "#f87171",
              fontSize: 14,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: "100%",
            maxWidth: 320,
          }}
        >
          <button
            onClick={handleUpgrade}
            disabled={loading || authLoading}
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
            {loading
              ? "Loading..."
              : isLoggedIn
                ? SANCTUARY_PREVIEW.cta_primary
                : "Sign up to continue"}
          </button>

          <Link
            href="/"
            style={{
              width: "100%",
              padding: "14px 24px",
              borderRadius: 12,
              background: "transparent",
              color: "#71717a",
              border: "1px solid #27272a",
              fontSize: 15,
              textAlign: "center",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            {SANCTUARY_PREVIEW.cta_secondary}
          </Link>
        </div>

        <p
          style={{
            fontSize: 12,
            color: "#52525b",
            marginTop: 32,
            textAlign: "center",
          }}
        >
          Cancel anytime. No questions asked.
        </p>
      </div>
    </main>
  );
}
