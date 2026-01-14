"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export function VoiceButton() {
  const { tier, loading } = useAuth();
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/voice")}
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: "rgba(139, 92, 246, 0.1)",
        border: "1px solid rgba(139, 92, 246, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
        marginRight: 8,
      }}
      title="Voice Mode"
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(139, 92, 246, 0.2)";
        e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.4)";
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
        e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.2)";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#a78bfa"
        strokeWidth="2"
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