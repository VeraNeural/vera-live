"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export function VoiceButton() {
  const { tier, loading } = useAuth();
  const router = useRouter();

  // Only show for Sanctuary users
  if (loading || tier !== "sanctuary") {
    return null;
  }

  return (
    <button
      onClick={() => router.push("/voice")}
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "transparent",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
        opacity: 0.5,
      }}
      title="Voice Mode"
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "1";
        e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "0.5";
        e.currentTarget.style.background = "transparent";
      }}
    >
      {/* Minimal Microphone Icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    </button>
  );
}
