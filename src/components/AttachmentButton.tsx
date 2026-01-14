"use client";

import { useRef } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

export function AttachmentButton(props: {
  disabled?: boolean;
  onSelect: (file: File) => void | Promise<void>;
}) {
  const { tier, loading } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  if (loading || tier !== "sanctuary") return null;

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          // Allow re-selecting the same file later.
          e.currentTarget.value = "";
          if (!file) return;
          void props.onSelect(file);
        }}
      />
      <button
        type="button"
        disabled={props.disabled}
        onClick={() => inputRef.current?.click()}
        title="Attach image (Sanctuary)"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "transparent",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: props.disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          opacity: props.disabled ? 0.35 : 0.55,
        }}
        onMouseEnter={(e) => {
          if (props.disabled) return;
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = props.disabled ? "0.35" : "0.55";
          e.currentTarget.style.background = "transparent";
        }}
      >
        {/* Paperclip icon */}
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
          <path d="M21.44 11.05 12 20.5a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
      </button>
    </>
  );
}
