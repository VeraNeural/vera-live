"use client";

import { useRef } from "react";
import { Paperclip } from "lucide-react";

export function AttachmentButton(props: {
  disabled?: boolean;
  onSelect: (file: File) => void | Promise<void>;
}) {
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
          background: "transparent",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: props.disabled ? "not-allowed" : "pointer",
          transition: "opacity 0.2s ease",
          opacity: props.disabled ? 0.4 : 0.6,
          marginRight: 8,
        }}
        onMouseEnter={(e) => {
          if (props.disabled) return;
          e.currentTarget.style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "0.6";
        }}
      >
        <Paperclip 
          size={20} 
          strokeWidth={1.5}
          style={{ transform: 'rotate(45deg)' }}
        />
      </button>
    </>
  );
}