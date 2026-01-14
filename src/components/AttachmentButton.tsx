"use client";

import { useRef } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

export function AttachmentButton(props: {
  disabled?: boolean;
  onSelect: (file: File) => void | Promise<void>;
}) {
  const { tier, loading } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          e.currentTarget.value = "";
          if (!file) return;
          void props.onSelect(file);
        }}
      />
      <button
        type="button"
        disabled={props.disabled}
        onClick={() => inputRef.current?.click()}
        title="Attach image"
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "rgba(139, 92, 246, 0.1)",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: props.disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          opacity: props.disabled ? 0.4 : 1,
          marginRight: 8,
        }}
        onMouseEnter={(e) => {
          if (props.disabled) return;
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
          <path d="M21.44 11.05 12 20.5a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
      </button>
    </>
  );
}