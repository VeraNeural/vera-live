"use client";

export function ImagePreview(props: {
  src: string;
  onRemove: () => void;
}) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 720,
        background: "#14141a",
        border: "1px solid #27272a",
        borderRadius: 16,
        padding: 12,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <img
        src={props.src}
        alt="Selected attachment"
        style={{
          maxHeight: 160,
          width: "auto",
          maxWidth: "85%",
          borderRadius: 12,
          border: "1px solid #27272a",
          objectFit: "cover",
          background: "#0b0b0f",
        }}
      />
      <button
        type="button"
        onClick={props.onRemove}
        title="Remove image"
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: "transparent",
          border: "1px solid #27272a",
          color: "#a1a1aa",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#8b5cf6";
          e.currentTarget.style.color = "#ffffff";
          e.currentTarget.style.background = "rgba(139, 92, 246, 0.06)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#27272a";
          e.currentTarget.style.color = "#a1a1aa";
          e.currentTarget.style.background = "transparent";
        }}
      >
        ×
      </button>
    </div>
  );
}
