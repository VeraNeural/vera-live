"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useHumeVoice, VoiceStatus } from "@/lib/hume/useHumeVoice";

export const dynamic = "force-dynamic";

// Hume Config
const HUME_API_KEY = process.env.NEXT_PUBLIC_HUMEAI_API_KEY || "";
const HUME_CONFIG_ID = "92c3f2c0-b1e8-4a91-9025-af585b921212";

const STATUS_MESSAGES: Record<VoiceStatus, string> = {
  idle: "Click to start",
  connecting: "Connecting...",
  connected: "Connected",
  listening: "Listening...",
  thinking: "Thinking...",
  speaking: "Speaking...",
  error: "Connection error",
};

const STATUS_COLORS: Record<VoiceStatus, string> = {
  idle: "#71717a",
  connecting: "#fbbf24",
  connected: "#8b5cf6",
  listening: "#8b5cf6",
  thinking: "#a78bfa",
  speaking: "#22c55e",
  error: "#ef4444",
};

export default function VoicePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { status, messages, connect, disconnect } = useHumeVoice({
    apiKey: HUME_API_KEY,
    configId: HUME_CONFIG_ID,
    onMessage: (msg) => {
      if (process.env.NODE_ENV === 'development') {
        console.log("[Voice] Message:", msg);
      }
    },
    onStatusChange: (s) => {
      if (process.env.NODE_ENV === 'development') {
        console.log("[Voice] Status:", s);
      }
    },
    onError: (err) => {
      setError(err);
    },
  });

  const isActive = status !== "idle" && status !== "error";

  function handleToggle() {
    if (isActive) {
      disconnect();
    } else {
      setError(null);
      connect();
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
          justifyContent: "space-between",
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

        <button
          onClick={() => {
            disconnect();
            router.push("/");
          }}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            background: "transparent",
            color: "#71717a",
            border: "1px solid #27272a",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Exit Voice
        </button>
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
        {/* ANIMATED ORB */}
        <button
          onClick={handleToggle}
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: `radial-gradient(circle at 30% 30%, ${
              isActive ? "#c4b5fd" : "#6b7280"
            }, ${isActive ? "#7c3aed" : "#374151"})`,
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: isActive
              ? `0 0 80px 30px rgba(139, 92, 246, 0.3)`
              : "0 0 40px 10px rgba(107, 114, 128, 0.1)",
            animation: status === "listening" ? "pulse 2s infinite" : "none",
          }}
        />

        {/* STATUS */}
        <p
          style={{
            marginTop: 32,
            fontSize: 18,
            fontWeight: 500,
            color: STATUS_COLORS[status],
            transition: "color 0.3s ease",
          }}
        >
          {STATUS_MESSAGES[status]}
        </p>

        {/* ERROR */}
        {error && (
          <p
            style={{
              marginTop: 16,
              fontSize: 14,
              color: "#ef4444",
            }}
          >
            {error}
          </p>
        )}

        {/* TRANSCRIPT (last few messages) */}
        {messages.length > 0 && (
          <div
            style={{
              marginTop: 48,
              maxWidth: 480,
              width: "100%",
              maxHeight: 200,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.slice(-4).map((msg, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: msg.type === "user" ? "#27272a" : "#1c1c24",
                  alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                }}
              >
                <p style={{ fontSize: 14, color: "#e4e4e7", lineHeight: 1.5 }}>
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* HINT */}
        <p
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 13,
            color: "#52525b",
          }}
        >
          {isActive
            ? "Tap the orb to end session"
            : "Tap the orb to start talking with VERA"}
        </p>
      </div>

      {/* PULSE ANIMATION */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 80px 30px rgba(139, 92, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 100px 40px rgba(139, 92, 246, 0.5);
          }
          100% {
            box-shadow: 0 0 80px 30px rgba(139, 92, 246, 0.3);
          }
        }
      `}</style>
    </main>
  );
}