"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FORGE_PREVIEW } from "@/lib/auth/gateMessages";

export default function ForgeLanding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");

  const whoItsFor = [
    "Builders and founders shipping real products",
    "Developers who want deterministic specs and APIs",
    "Operators who need repeatable, governed output",
  ];

  const whatYouGet = [
    "Structured specs and PRDs",
    "Technical design docs and API contracts",
    "Landing page outlines and marketing drafts",
    "Deterministic flow that stays consistent",
  ];

  const comparison = [
    {
      title: "Forge",
      points: [
        "Structured outputs with clear contracts",
        "Repeatable, deterministic delivery",
        "Governed flow across artifacts",
      ],
    },
    {
      title: "ChatGPT / Claude / Grok",
      points: [
        "Freeform answers, variable structure",
        "Low repeatability across sessions",
        "No governance between artifacts",
      ],
    },
  ];

  async function handleUpgrade() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/forge-checkout", {
        method: "POST",
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

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
            background: "radial-gradient(circle at 30% 30%, #fde68a, #f59e0b)",
            marginBottom: 32,
            boxShadow: "0 0 60px 20px rgba(245, 158, 11, 0.25)",
          }}
        />

        <div
          style={{
            padding: "6px 16px",
            borderRadius: 20,
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "1px",
            marginBottom: 24,
          }}
        >
          FORGE
        </div>

        <h1
          style={{
            fontSize: 36,
            fontWeight: 600,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          {FORGE_PREVIEW.title}
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
          {FORGE_PREVIEW.description}
        </p>

        <div
          style={{
            width: "100%",
            maxWidth: 720,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: "#14141a",
              border: "1px solid #27272a",
            }}
          >
            <div style={{ fontSize: 12, color: "#f59e0b", marginBottom: 8, letterSpacing: "0.12em" }}>
              WHAT IT IS
            </div>
            <div style={{ fontSize: 14, color: "#e4e4e7", lineHeight: 1.7 }}>
              Structured build + ship environment for deterministic specs, plans, and execution artifacts.
            </div>
          </div>
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: "#14141a",
              border: "1px solid #27272a",
            }}
          >
            <div style={{ fontSize: 12, color: "#f59e0b", marginBottom: 8, letterSpacing: "0.12em" }}>
              WHO IT'S FOR
            </div>
            <div style={{ fontSize: 14, color: "#e4e4e7", lineHeight: 1.7 }}>
              {whoItsFor.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </div>
        </div>

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
          {FORGE_PREVIEW.features.map((feature, i) => (
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
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
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
            width: "100%",
            maxWidth: 720,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: "#14141a",
              border: "1px solid #27272a",
            }}
          >
            <div style={{ fontSize: 12, color: "#f59e0b", marginBottom: 8, letterSpacing: "0.12em" }}>
              WHAT YOU GET
            </div>
            <div style={{ fontSize: 14, color: "#e4e4e7", lineHeight: 1.7 }}>
              {whatYouGet.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </div>
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: "#14141a",
              border: "1px solid #27272a",
            }}
          >
            <div style={{ fontSize: 12, color: "#f59e0b", marginBottom: 8, letterSpacing: "0.12em" }}>
              COMPARISON
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {comparison.map((block) => (
                <div key={block.title} style={{ padding: 12, borderRadius: 10, background: "#101015", border: "1px solid #24242a" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e4e4e7", marginBottom: 6 }}>{block.title}</div>
                  <div style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.6 }}>
                    {block.points.map((point) => (
                      <div key={point}>{point}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 48, fontWeight: 700 }}>$29</span>
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
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px 24px",
              borderRadius: 12,
              background: loading
                ? "#92400e"
                : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "white",
              border: "none",
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: loading
                ? "none"
                : "0 4px 14px 0 rgba(245, 158, 11, 0.3)",
            }}
          >
            {loading ? "Loading..." : FORGE_PREVIEW.cta_primary}
          </button>

          <Link
            href="/sanctuary"
            style={{
              width: "100%",
              padding: "14px 24px",
              borderRadius: 12,
              background: "transparent",
              color: "#a1a1aa",
              border: "1px solid #27272a",
              fontSize: 15,
              fontWeight: 500,
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            {FORGE_PREVIEW.cta_secondary}
          </Link>
        </div>
      </div>
    </main>
  );
}
