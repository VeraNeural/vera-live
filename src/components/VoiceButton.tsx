"use client";

import { useRouter } from "next/navigation";
import { Mic } from "lucide-react";

export function VoiceButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/voice")}
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: "transparent",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "opacity 0.2s ease",
        opacity: 0.6,
        marginRight: 8,
      }}
      title="Voice Mode"
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "0.6";
      }}
    >
      <Mic 
        size={20} 
        strokeWidth={1.5}
      />
    </button>
  );
}