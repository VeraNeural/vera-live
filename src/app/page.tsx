"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AttachmentButton } from "@/components/AttachmentButton";
import { ImagePreview } from "@/components/ImagePreview";
import { VoiceButton } from "@/components/VoiceButton";
import { useAuth } from "@/lib/auth/AuthContext";
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
  "Help me process something",
  "Build something with me",
  "I just need to vent",
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
  const { user, isLoggedIn } = useAuth();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [greeting] = useState(getGreeting());
  const endRef = useRef<HTMLDivElement>(null);
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
            style={{
              width: 120,
              height: 120,
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
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
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
    </main>
  );
}