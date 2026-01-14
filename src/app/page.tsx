"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AttachmentButton } from "@/components/AttachmentButton";
import { ImagePreview } from "@/components/ImagePreview";
import { VoiceButton } from "@/components/VoiceButton";
import {
  GATE_MESSAGES,
  SANCTUARY_PREVIEW,
  type GateType,
} from "@/lib/auth/gateMessages";
import { fileToBase64, getMediaType, isValidImageType } from "@/lib/fileUtils";

type Message = {
  role: "user" | "assistant";
  content: string;
  image?: {
    base64: string;
    mediaType: string;
  };
};

const QUICK_STARTS = [
  "Job search support",
  "Build a project",
  "Write together",
  "Research & understand",
  "Learn something new",
  "Design & structure ideas",
  "Think through a business",
  "Just talk",
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "Good evening";
  } else {
    return "Good evening";
  }
}

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [greeting] = useState(getGreeting());
  const endRef = useRef<HTMLDivElement>(null);
  const [activeGate, setActiveGate] = useState<GateType | null>(null);
  const [attachedImage, setAttachedImage] = useState<{
    base64: string;
    mediaType: string;
    previewUrl: string;
  } | null>(null);
  const [attachmentError, setAttachmentError] = useState("");

  const hasStarted = messages.length > 0;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const gateDismissible = activeGate === "limit_reached";

  useEffect(() => {
    if (!activeGate) return;
    if (!gateDismissible) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveGate(null);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeGate, gateDismissible]);

  async function handleSelectImage(file: File) {
    setAttachmentError("");
    if (!isValidImageType(file)) {
      setAttachmentError("Please select a JPG, PNG, WebP, or GIF image.");
      return;
    }

    const mediaType = getMediaType(file);
    const base64 = await fileToBase64(file);
    if (!base64) {
      setAttachmentError("Couldn't read that image. Please try a different file.");
      return;
    }

    setAttachedImage({
      base64,
      mediaType,
      previewUrl: `data:${mediaType};base64,${base64}`,
    });
  }

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    // Snapshot state for safe revert in gate flows.
    const messagesSnapshot = messages;
    const attachedSnapshot = attachedImage;

    const userMessage: Message = {
      role: "user",
      content,
      image: attachedImage
        ? { base64: attachedImage.base64, mediaType: attachedImage.mediaType }
        : undefined,
    };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setAttachedImage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await res.json();

      const gate = (data?.gate ?? null) as GateType | null;
      if (gate === "auth_required") {
        // Do NOT append the user's message. Restore input and show gate UI.
        setMessages(messagesSnapshot);
        setInput(content);
        setAttachedImage(attachedSnapshot);
        setActiveGate("auth_required");
        return;
      }

      if (gate === "limit_reached") {
        // Show VERA's in-chat response, then show the gate modal.
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              data?.content ??
              "I can stay with you — Sanctuary unlocks longer conversations, saved sessions, and deeper support.",
          },
        ]);
        setActiveGate("limit_reached");
        return;
      }

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data?.content ?? "Sorry — no response returned.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry — something went wrong. Please try again.",
        },
      ]);
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
        <strong style={{ fontSize: 18, letterSpacing: "0.5px" }}>VERA</strong>
        <div style={{ display: "flex", gap: 12 }}>
          {/* Sign In Button - Ghost style */}
          <Link
            href="/login"
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              background: "transparent",
              color: "#a1a1aa",
              border: "1px solid #27272a",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
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
            Sign In
          </Link>
          {/* Start Free Button - Primary style */}
          <Link
            href="/signup"
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              color: "white",
              border: "none",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 14px 0 rgba(139, 92, 246, 0.3)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 20px 0 rgba(139, 92, 246, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px 0 rgba(139, 92, 246, 0.3)";
            }}
          >
            Start Free
          </Link>
        </div>
      </header>

      {/* HERO / INTRO */}
      {!hasStarted && (
        <section
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 120,
          }}
        >
          {/* ORB */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 30%, #c4b5fd, #7c3aed)",
              marginBottom: 32,
              boxShadow: "0 0 60px 20px rgba(139, 92, 246, 0.2)",
            }}
          />

          <h1 style={{ fontSize: 48, marginBottom: 8, fontWeight: 600 }}>
            {greeting}
          </h1>
          <p style={{ opacity: 0.6, marginBottom: 40, fontSize: 16 }}>
            AI that helps you do anything, your way, your pace
          </p>

          {/* INPUT (INITIAL) */}
          <div style={{ width: "100%", maxWidth: 720, marginBottom: 24 }}>
            {attachmentError && (
              <p
                style={{
                  color: "#f87171",
                  fontSize: 13,
                  margin: "0 0 10px 0",
                  textAlign: "center",
                }}
              >
                {attachmentError}
              </p>
            )}
            {attachedImage && (
              <div style={{ marginBottom: 12 }}>
                <ImagePreview
                  src={attachedImage.previewUrl}
                  onRemove={() => setAttachedImage(null)}
                />
              </div>
            )}
            <div
              style={{
                display: "flex",
                width: "100%",
                background: "#14141a",
                borderRadius: 999,
                padding: "8px 12px",
                border: "1px solid #27272a",
              }}
            >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="What's on your mind?"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: 16,
                padding: "8px 12px",
              }}
            />

            <AttachmentButton disabled={loading} onSelect={handleSelectImage} />
            <VoiceButton />

            <button
              onClick={() => sendMessage()}
              style={{
                padding: "12px 24px",
                borderRadius: 999,
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                color: "white",
                border: "none",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Ask VERA
            </button>
            </div>
          </div>

          {/* QUICK START */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
              maxWidth: 720,
            }}
          >
            {QUICK_STARTS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  background: "#1c1c24",
                  color: "#a1a1aa",
                  border: "1px solid #27272a",
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#8b5cf6";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.background = "#252530";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#27272a";
                  e.currentTarget.style.color = "#a1a1aa";
                  e.currentTarget.style.background = "#1c1c24";
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* CHAT VIEW */}
      {hasStarted && (
        <section
          style={{
            flex: 1,
            padding: "24px",
            paddingBottom: 120,
            maxWidth: 720,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent:
                  m.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 16,
                  maxWidth: "85%",
                  background:
                    m.role === "user"
                      ? "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                      : "#1c1c24",
                  lineHeight: 1.5,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {m.image && (
                    <img
                      src={`data:${m.image.mediaType};base64,${m.image.base64}`}
                      alt="Attachment"
                      style={{
                        width: "100%",
                        maxWidth: 420,
                        borderRadius: 12,
                        border: "1px solid rgba(0,0,0,0.15)",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div>{m.content}</div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 16,
                  background: "#1c1c24",
                  color: "#a1a1aa",
                }}
              >
                Thinking…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </section>
      )}

      {/* INPUT (CHAT MODE) */}
      {hasStarted && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 16px",
            gap: 12,
          }}
        >
          {attachmentError && (
            <p style={{ color: "#f87171", fontSize: 13, margin: 0 }}>
              {attachmentError}
            </p>
          )}
          {attachedImage && (
            <ImagePreview
              src={attachedImage.previewUrl}
              onRemove={() => setAttachedImage(null)}
            />
          )}
          <div
            style={{
              display: "flex",
              width: "100%",
              maxWidth: 720,
              background: "#14141a",
              borderRadius: 999,
              padding: "8px 12px",
              border: "1px solid #27272a",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask VERA anything…"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: 16,
                padding: "8px 12px",
              }}
            />

            <AttachmentButton disabled={loading} onSelect={handleSelectImage} />
            <VoiceButton />

            <button
              onClick={() => sendMessage()}
              style={{
                padding: "12px 24px",
                borderRadius: 999,
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                color: "white",
                border: "none",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Ask VERA
            </button>
          </div>
        </div>
      )}

      {/* GATE MODAL */}
      {activeGate && (
        <div
          onClick={() => {
            if (gateDismissible) setActiveGate(null);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 520,
              background: "#0f0f14",
              border: "1px solid #27272a",
              borderRadius: 18,
              padding: 20,
              boxShadow: "0 18px 60px rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  {GATE_MESSAGES[activeGate].title}
                </div>
                <div style={{ color: "#a1a1aa", lineHeight: 1.5 }}>
                  {GATE_MESSAGES[activeGate].message}
                </div>
              </div>

              {gateDismissible && (
                <button
                  onClick={() => setActiveGate(null)}
                  aria-label="Close"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    border: "1px solid #27272a",
                    background: "transparent",
                    color: "#a1a1aa",
                    cursor: "pointer",
                    fontSize: 18,
                    lineHeight: "36px",
                  }}
                >
                  ×
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <Link
                href={GATE_MESSAGES[activeGate].cta_link}
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  borderRadius: 12,
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  color: "white",
                  fontWeight: 700,
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                {GATE_MESSAGES[activeGate].cta}
              </Link>

              {gateDismissible && (
                <button
                  onClick={() => setActiveGate(null)}
                  style={{
                    flex: 1,
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid #27272a",
                    background: "transparent",
                    color: "#e4e4e7",
                    fontWeight: 650,
                    cursor: "pointer",
                  }}
                >
                  {SANCTUARY_PREVIEW.cta_secondary}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}